<script setup lang="ts">
import GameCreationForm from "@/components/GameCreation/GameCreationForm.vue";
import GameList from "@/components/GameList.vue";
import { SITE_NAME } from "@ogfcommunity/variants-shared";
</script>

<template>
  <main>
    <div class="grid-page-layout">
      <div>
        <h2>Welcome to {{ SITE_NAME }}!</h2>
        <div class="navigation-links">
          <router-link to="/leaderboard" class="nav-link">
            🏆 Global Leaderboard
          </router-link>
        </div>
        <GameCreationForm />
      </div>
      <div>
        <GameList />
      </div>
    </div>
  </main>
</template>

<style scoped>
.navigation-links {
  margin-bottom: 1rem;
}

.nav-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: black !important;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #0056b3;
  color: black !important;
}
</style>
