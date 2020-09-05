<template>
    <v-dialog
        v-model="dialog"
        width="500"
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
            color="red lighten-2"
            dark
            v-bind="attrs"
            v-on="on"
            >
            إضافه موعد
            </v-btn>
        </template>

        <v-card>
            <v-card-title class="headline grey lighten-2">
            {{ singleClass.subject.subject_name }}
            </v-card-title>
            <v-card-text>
                <form>
                    <v-time-picker v-model="start_at"></v-time-picker>
                </form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="dialog = false"
            >
                I accept
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'addSchedule',
    props: {
        singleClass: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            start_at: '',
            dialog: false,
        }
    }
}
</script>