<template>
    <transition name="modal" v-if="show">
        <div class="modal-mask">
            <div class="row">
                <ul v-sortable="{ onUpdate: onUpdate ,onSort:onSortProxy}">
                    <li v-for="item in list" class="record">

                        <p>
                            name : {{ item.name }}
                            <span class="delete" @click="editItem(item)">Edit</span>
                            <span class="delete" @click="removeItem(item)">Delete</span>
                        </p>

                        <p v-if="item.edit">
                            <input v-model="nameInput" @keyup="updateName(item)"/>
                        </p>

                    </li>
                </ul>
            </div>

            <div class="row">
                <input v-model="name"/>
                <button @click="addNew">Add</button>
                <button @click="closeModal">close</button>
            </div>

            <div class="row">
                <ul>
                    <li v-for="item in listMirror"> name : {{ item.name }}</li>
                </ul>
            </div>

        </div>
    </transition>
</template>

<script>
    import fetch from 'isomorphic-fetch'
    class Item {
        constructor(index) {
            this.name = "name_" + index;
            this.id = index;
            this.index = index;
            this.edit = false
        }
    }

    export default {
        props: ['data'],
        data () {
            return {
                show: true,
                name: "",
                list: [],
                listMirror: [],
                nameInput: "",
            };
        },
        watch: {
            listMirror(){
                console.log(JSON.stringify(this.listMirror));
                const self = this;
                fetch('/project/chapter/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                    },
                    body: JSON.stringify(self.listMirror),
                });
            },
        },
        methods: {
            closeModal(){
                this.show = false;
            },
            add(val){
                if (!val) {
                    return false
                }
                this.list.push(new Item(this.list.length + 1));
                this.listMirror.push(new Item(this.listMirror.length + 1));
            },
            addNew(){
                this.add(this.name);
                this.name = "";
            },
            updateName(val){
                this.list.forEach((v) => {
                    val.id === v.id ? v.name = this.nameInput : null;
                });
            },
            editItem(val){
                this.list.forEach((v) => {
                    v.edit = val.id === v.id ? !v.edit : false;
                });
                this.nameInput = val.name;
            },
            removeItem(val){
                this.list = this.list.filter(e => {
                    return (e.id !== val.id);
                });
                this.listMirror = this.listMirror.filter(e => {
                    return (e.id !== val.id);
                });
                this.updateOrder();
            },
            updateOrder(){
                let i = 0;
                this.listMirror = this.listMirror.map(v => {
                    v.index = i;
                    i++;
                    return v
                });
            },
            onSort (event) {
                const orgItem = this.listMirror[event.oldIndex];
                this.listMirror.splice(event.oldIndex, 1);
                this.listMirror.splice(event.newIndex, 0, orgItem);
                this.updateOrder();
            },
            onSortProxy(event){
                this.onSort(event);
            }
        },
        mounted() {
            for (let i = 0; i < 4; i++) {
                this.add(i);
            }
            this.updateOrder();
        },
    }
</script>

<style>

    body {
        background-color: rebeccapurple;
    }

    .row {
        margin: 10px;
    }

    input {
        width: 100%;
        padding: 10px 2px;
    }

    button {
        margin: 5px 0px;
        width: 100%;
        background: #fa4d68;
        border: none;
        padding: 10px;
        color: #fff;
    }

    button:hover {
        opacity: 0.7;
    }

    ul {
        margin: 0px;
        padding: 0px;
    }

    .record {
        border: solid 1px #efefef;
        border-radius: 2px;
        margin: 10px 0px;
        padding: 20px;
        display: block;
    }

    .record:hover {
        background: antiquewhite;
    }

    .delete {
        background: #f5f3f0;
        padding: 5px 15px;
        margin-left: 10px;
        border-radius: 2px;
        float: right;
    }

    .delete:hover {
        color: #fff;
        background: rebeccapurple;
    }

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(245, 245, 245, 0.7);
        display: table;
        transition: opacity .3s ease;
    }

</style>
