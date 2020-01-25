<template>
  <div>
    <v-row>
      <v-col md="4">
        <h2
          class="text-center mb-5"
        >
          Female
        </h2>
        <v-row
          v-for="(item,index) in recentUsers"
          :key="index"
        >
          <UserCard
            :userUser="item.user"
            :userSex="item.sex"
            :userDescription="item.description"
            class="mb-5"
          >
            <template
              v-slot:button
            >
              <v-btn
                @click.stop="edit(item,index)"
              >
                Edit
              </v-btn>
              <v-btn
                @click.stop="remove(item.preference, index)"
              >
                Remove
              </v-btn>
            </template>
          </UserCard>
        </v-row>
      </v-col>
      <v-col md="4">
        <h2
          class="text-center mb-5"
        >
          Male
        </h2>
        <v-row
          v-for="(item,index) in recentUsers"
          :key="index"
        >
          <UserCard
            :userUser="item.user"
            :userSex="item.sex"
            :userDescription="item.description"
            class="mb-5"
          >
            <template
              v-slot:button
            >
              <v-btn
                @click.stop="edit(item,index)"
              >
                Edit
              </v-btn>
              <v-btn
                @click.stop="remove(item.preference, index)"
              >
                Remove
              </v-btn>
            </template>
          </UserCard>
        </v-row>
      </v-col>
      <v-col md="4">
        <h2
          class="text-center mb-5"
        >
          Bi
        </h2>
        <v-row
          v-for="(item,index) in recentUsers"
          :key="index"
        >
          <UserCard
            :userUser="item.user"
            :userSex="item.sex"
            :userDescription="item.description"
            class="mb-5"
          >
            <template
              v-slot:button
            >
              <v-btn
                @click.stop="edit(item,index)"
              >
                Edit
              </v-btn>
              <v-btn
                @click.stop="remove(item.preference, index)"
              >
                Remove
              </v-btn>
            </template>
          </UserCard>
        </v-row>
      </v-col>
    </v-row>
    <userModal />
  </div>
</template>

<script>
import UserCard from '@/components/entest/UserCard'

export default {
  components: {
    UserCard
  },
  data () {
    return {
      Female: [],
      Male: [],
      Bi: []
    }
  }
}
</script>
