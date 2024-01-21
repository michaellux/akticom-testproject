<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="main">
        <transition name="fade" mode="out-in">
            <div v-if="dataLoaded" class="addclient-block">
                <strong>{{
                    editMode ? 'Редактирование' : 'Добавление'
                }}</strong>
                <Control
                    @keydown.enter="addClient"
                    v-model="addName"
                    name="ФИО"
                    type="byText"
                />
                <Control
                    @keydown.enter="addClient"
                    v-model="addPhone"
                    name="Телефон"
                    type="byPhone"
                />
                <Control
                    v-model="addRegion"
                    name="Регион"
                    type="byOptions"
                    :options="regions.filter((item) => item.name !== 'Любой')"
                />
                <Control
                    v-model="addStatus"
                    name="Статус"
                    type="byOptions"
                    :options="statuses.filter((item) => item.name !== 'Любой')"
                />
                <button
                    class="gain-center"
                    v-if="editMode"
                    @click="saveChanges"
                >
                    Сохранить
                </button>
            </div>
        </transition>
        <transition name="fade" mode="out-in">
            <div v-if="dataLoaded" class="filters">
                <strong>Фильтры</strong>
                <Control v-model="name" name="По ФИО" type="byText" />
                <Control
                    v-model="region"
                    name="По региону"
                    type="byOptions"
                    :options="regions"
                />
                <Control
                    v-model="status"
                    name="По статусу"
                    type="byOptions"
                    :options="statuses"
                />
            </div>
        </transition>
        <transition name="fade" mode="out-in">
            <table v-if="dataLoaded" class="table">
                <thead>
                    <th v-for="(key, index) in clientListKeys" :key="index">
                        {{ key }}
                    </th>
                </thead>
                <tbody v-draggable="filteredClientList">
                    <tr
                        v-for="(item, index) in filteredClientList"
                        :key="index"
                    >
                        <td
                            v-for="(val, key) in item"
                            @click="navigateToClientDetails(item.id)"
                            :key="key"
                        >
                            {{ val }}
                        </td>
                        <button
                            class="gain-center"
                            @click="activateEditMode(item.id)"
                        >
                            Редактировать
                        </button>
                        <button
                            class="gain-center"
                            @click="removeClient(item.id)"
                        >
                            Удалить
                        </button>
                    </tr>
                </tbody>
            </table>
        </transition>
        <p v-if="!dataLoaded">Загрузка данных...</p>
    </div>
</template>

<script setup lang="ts">
import { DateTime } from 'ts-luxon'
import { Option } from '../types/Option'
import { Client } from '../types/Client'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsStore } from '../store'
import Control from './Control.vue'
import { vDraggable } from 'vue-draggable-plus'
const dataLoaded = ref<boolean>(false)
const startClientList = ref()
const regions = ref<Option[]>([{ id: 'all', name: 'Любой' }])
const statuses = ref<Option[]>([{ id: 'all', name: 'Любой' }])
const name = ref('')
const region = ref('Любой')
const status = ref('Любой')
const addName = ref('')
const addPhone = ref('')
const addRegion = ref('')
const addStatus = ref('')
const clientListKeys = ref<String[]>([])
const formattedClientList = ref<Client[]>([])
const clientStore = useClientsStore()
const editMode = ref(false)
const clientForEdit = ref<Client>()
const clientForSave = ref<Client>()
onMounted(() => {
    fetchData()
})

const fetchData = async () => {
    await clientStore.getClientsData()
    if (clientStore.clients) {
        fillData()
    }
}

const filteredClientList = computed(() => {
    return formattedClientList.value.filter((item: Client) => {
        return (
            (name.value === ''
                ? true
                : item.fullname
                      .toLowerCase()
                      .includes(name.value.toLowerCase())) &&
            (region.value === 'Любой' ? true : item.region === region.value) &&
            (status.value === 'Любой' ? true : item.status === status.value)
        )
    })
})

const fillData = () => {
    console.log(clientStore.clients)
    startClientList.value = clientStore.clients
    clientListKeys.value = Object.keys(startClientList.value[0])

    startClientList.value.forEach((item: Client) => {
        let foundRegion = regions.value.find((el) => el.name === item.region)
        if (!foundRegion) {
            regions.value = [
                ...regions.value,
                {
                    id: item.id,
                    name: item.region,
                },
            ]
        }
        let foundStatus = statuses.value.find((el) => el.name === item.status)
        if (!foundStatus) {
            statuses.value = [
                ...statuses.value,
                {
                    id: item.id,
                    name: item.status,
                },
            ]
        }
    })

    dataLoaded.value = true

    addRegion.value = regions.value[1].name
    addStatus.value = statuses.value[1].name

    formattedClientList.value = startClientList.value.map((item: Client) => {
        return {
            id: item.id,
            fullname: item.fullname,
            created_at: DateTime.fromISO(item.created_at).toFormat('dd/MM/yy'),
            phone: item.phone,
            region: item.region,
            status: item.status,
        }
    })
}

const addClient = () => {
    console.log('addClient')
    const newClient = {
        fullname: addName.value,
        phone: addPhone.value,
        region: addRegion.value,
        status: addStatus.value,
    }
    clientStore.addClient(newClient)
    console.log(clientStore.lastItem)
    localStorage.setItem(
        `CLient#${clientStore.maxId}`,
        JSON.stringify(clientStore.lastItem)
    )
    fillData()
}

const removeClient = (clientId: number) => {
    clientStore.removeClient(clientId)
    fillData()
}

const activateEditMode = (clientId: number) => {
    editMode.value = true
    clientForEdit.value = clientStore.clients.find(
        (client) => client.id === clientId
    )
    if (clientForEdit.value !== undefined) {
        addName.value = clientForEdit.value.fullname
        addPhone.value = clientForEdit.value.phone
        addRegion.value = clientForEdit.value.region
        addStatus.value = clientForEdit.value.status
    } else {
        console.error(`Client with id ${clientId} not found.`)
    }
}

const saveChanges = () => {
    console.log('Сохранить изменения')
    clientForSave.value = clientForEdit.value
    if (clientForSave.value !== undefined) {
        clientForSave.value.fullname = addName.value
        clientForSave.value.phone = addPhone.value
        clientForSave.value.region = addRegion.value
        clientForSave.value.status = addStatus.value
        clientStore.updateClient(clientForSave.value)
        fillData()
    }
    addName.value = ''
    addPhone.value = ''
    addRegion.value = regions.value[1].name
    addStatus.value = statuses.value[1].name
    editMode.value = false
}

const router = useRouter()
const navigateToClientDetails = (clientId: number) => {
    const currentItem = filteredClientList.value.find(
        (el) => el.id === clientId
    )
    localStorage.setItem('currentClient', JSON.stringify(currentItem))
    router.push(`/client/${clientId}`)
}
</script>

<style scoped>
.main {
    width: 80vw;
    height: 85vh;
    background: transparent;
    color: rgb(17, 16, 16);
}
.addclient-block {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0.7rem;
    gap: 0.6rem;
}
.filters {
    display: flex;
    margin: 1rem 0.7rem;
    gap: 1rem;
}
.table {
    width: 100%;
    border: 5px solid #fff;
    border-top: 5px solid #fff;
    border-bottom: 3px solid #fff;
    border-collapse: collapse;
    font-size: 15px;
    background: #fff !important;
}
.table th {
    font-weight: bold;
    padding: 7px;
    border: none;
    text-align: left;
    font-size: 15px;
    border-top: 3px solid #fff;
}
.table td {
    padding: 7px;
    border: none;
    border-top: 3px solid #fff;
    border-bottom: 3px solid #fff;
    font-size: 10px;
    text-align: left;
}
.table td:nth-child(2) {
    cursor: pointer;
    transition: 0.3s; /* Время эффекта */
}
.table td:nth-child(2):hover {
    text-decoration: underline;
    transform: scale(1.2); /* Увеличиваем масштаб */
}
.table td:not(:nth-child(2)) {
    pointer-events: none;
}
.table tbody tr:nth-child(even) {
    background: #f8f8f8 !important;
}
button {
    display: inline-block;
    box-sizing: border-box;
    padding: 0;
    margin: 0 15px 0 0;
    outline: none;
    border: none;
    border-radius: 4px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    color: #1976d2;
    background-color: transparent;
    cursor: pointer;
    user-select: none;
    appearance: none;
    touch-action: manipulation;
    vertical-align: top;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}
.gain-center {
    transition: 0.3s; /* Время эффекта */
    text-align: center;
}
.gain-center:hover {
    transform: scale(1.2); /* Увеличиваем масштаб */
}
</style>