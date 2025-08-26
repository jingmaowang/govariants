<script setup lang="ts">
import { UserResponse, UserRole } from "@ogfcommunity/variants-shared";
import { ref, watchEffect } from "vue";
import * as requests from "../requests";
import { useCurrentUser } from "@/stores/user";
import Swal from "sweetalert2";
import router from "@/router";

const props = defineProps<{ userId: string }>();

const user = ref<UserResponse>();
const err = ref<string>();

watchEffect(async () => {
  try {
    user.value = await requests.get(`/users/${props.userId}`);
  } catch (e) {
    err.value = e as string;
  }
});
const loggedInUser = useCurrentUser();

function setRole(role: UserRole) {
  requests
    .put(`/users/${props.userId}/role`, { role })
    .then(() => (user.value = user.value ? { ...user.value, role } : undefined))
    .catch(alert);
}

// Format rating display
function formatRating(rating: number, rd: number, vol: number) {
  return `${Math.round(rating)} ± ${Math.round(rd)} (vol: ${vol.toFixed(4)})`;
}

// Get all supported variants list
const supportedVariants = [
  "baduk",
  "phantom",
  "capture",
  "tetris",
  "pyramid",
  "thue-morse",
  "freeze",
  "fractional",
  "keima",
  "one color",
  "drift",
  "quantum",
  "sfractional",
];

async function launchDeleteUserDialog() {
  if (!user.value) {
    Swal.fire({ icon: "error", text: "User is undefined!" });
    return;
  }

  const userToDelete = user.value;
  const { value: nameForVerification } = await Swal.fire({
    title: "Delete User",
    text: `Are you sure you want to delete user '${userToDelete.username}'`,
    input: "text",
    inputPlaceholder: "To confirm, type the username here",
    showCancelButton: true,
  });

  if (nameForVerification !== userToDelete.username) {
    Swal.fire({
      icon: "error",
      text: "Name did not match!",
    });
  } else {
    try {
      await requests.del(`/users/${props.userId}`);
      Swal.fire(`Successfully deleted user: ${userToDelete.username}`);
      router.push("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Could not delete user...",
        text: `${(error as Error).message}`,
      });
    }
  }
}
</script>

<template>
  <main>
    <div class="grid-page-layout">
      <div v-if="user">
        <div class="user-info">
          <h2>User Information</h2>
          <div v-if="user.login_type === 'guest'" class="user-type">
            Guest User
          </div>
          <div v-else class="username">{{ user.username }}</div>
          <div v-if="user.role" class="user-role">Role: {{ user.role }}</div>
        </div>

        <!-- Rating information -->
        <div
          v-if="user.ranking && Object.keys(user.ranking).length > 0"
          class="ratings-section"
        >
          <h3>Game Ratings</h3>
          <div class="ratings-grid">
            <div
              v-for="(rating, variant) in user.ranking"
              :key="variant"
              class="rating-item"
            >
              <div class="variant-name">{{ variant }}</div>
              <div class="rating-value">
                {{ formatRating(rating.rating, rating.rd, rating.vol) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Unrated variants -->
        <div v-if="user.ranking" class="unrated-variants">
          <h4>Unrated Variants</h4>
          <div class="unrated-list">
            <span
              v-for="variant in supportedVariants.filter(
                (v) => !user.ranking[v],
              )"
              :key="variant"
              class="unrated-variant"
            >
              {{ variant }}
            </span>
          </div>
        </div>

        <div v-if="loggedInUser?.role === 'admin'" class="admin-actions">
          <button v-if="user.role !== 'admin'" @click="setRole('admin')">
            Make Admin
          </button>
          <button @click="launchDeleteUserDialog()">Delete User</button>
        </div>
      </div>
      <div v-if="err">{{ err }}</div>
    </div>
  </main>
</template>

<style scoped>
.user-info {
  margin-bottom: 2rem;
}

.user-type,
.username {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.user-role {
  color: #666;
  font-style: italic;
}

.ratings-section {
  margin-bottom: 2rem;
}

.ratings-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.ratings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.rating-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9f9f9;
}

.variant-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.rating-value {
  font-family: monospace;
  color: #666;
}

.unrated-variants {
  margin-bottom: 2rem;
}

.unrated-variants h4 {
  margin-bottom: 0.5rem;
  color: #666;
}

.unrated-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.unrated-variant {
  background-color: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #888;
  text-transform: capitalize;
}

.admin-actions {
  margin-top: 2rem;
}

.admin-actions button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.admin-actions button:first-child {
  background-color: #007bff;
  color: white;
}

.admin-actions button:last-child {
  background-color: #dc3545;
  color: white;
}
</style>
