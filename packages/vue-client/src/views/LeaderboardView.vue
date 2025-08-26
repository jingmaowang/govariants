<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { getVariantList } from "@ogfcommunity/variants-shared";
import * as requests from "../requests";

interface LeaderboardEntry {
  username?: string;
  rating: number;
  rd: number;
  vol: number;
}

const selectedVariant = ref("baduk");
const leaderboard = ref<LeaderboardEntry[]>([]);
const loading = ref(false);
const error = ref<string>();

// Get supported variants dynamically from shared library
const supportedVariants = getVariantList();

// Variant display name mapping
const variantDisplayNames: Record<string, string> = {
  baduk: "Baduk",
  phantom: "Phantom",
  parallel: "Parallel",
  capture: "Capture",
  chess: "Chess",
  tetris: "Tetris",
  pyramid: "Pyramid",
  "thue-morse": "Thue-Morse",
  freeze: "Freeze",
  fractional: "Fractional",
  keima: "Keima",
  "one color": "One Color",
  drift: "Drift",
  quantum: "Quantum",
  sfractional: "Sequential Fractional",
  lighthouse: "Lighthouse",
  "super tic-tac-go": "Super Tic-Tac-Go",
};

// Fetch leaderboard data
async function fetchLeaderboard(variant: string) {
  loading.value = true;
  error.value = "";

  try {
    const response = await requests.get(`/leaderboard?variant=${variant}`);
    leaderboard.value = response;
  } catch (e) {
    error.value = e as string;
    leaderboard.value = [];
  } finally {
    loading.value = false;
  }
}

// Watch for variant changes
watchEffect(() => {
  if (selectedVariant.value) {
    fetchLeaderboard(selectedVariant.value);
  }
});

// Get rank
function getRank(index: number): string {
  const rank = index + 1;
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}
</script>

<template>
  <main>
    <div class="leaderboard-container">
      <h1>Game Leaderboard</h1>

      <!-- Variant selector -->
      <div class="variant-selector">
        <label for="variant-select">Select Game Variant:</label>
        <select
          id="variant-select"
          v-model="selectedVariant"
          class="variant-select"
        >
          <option
            v-for="variant in supportedVariants"
            :key="variant"
            :value="variant"
          >
            {{ variantDisplayNames[variant] || variant }}
          </option>
        </select>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading">Loading...</div>

      <!-- Error message -->
      <div v-else-if="error" class="error">Loading failed: {{ error }}</div>

      <!-- Leaderboard content -->
      <div v-else-if="leaderboard.length > 0" class="leaderboard-content">
        <h2>
          {{ variantDisplayNames[selectedVariant] || selectedVariant }}
          Leaderboard
        </h2>

        <div class="leaderboard-table">
          <div class="table-header">
            <div class="rank-col">Rank</div>
            <div class="username-col">Username</div>
            <div class="rating-col">Rating</div>
            <div class="rd-col">RD</div>
            <div class="vol-col">Volatility</div>
          </div>

          <div
            v-for="(entry, index) in leaderboard"
            :key="index"
            class="table-row"
            :class="{ 'top-three': index < 3 }"
          >
            <div class="rank-col">{{ getRank(index) }}</div>
            <div class="username-col">
              {{ entry.username || "Anonymous User" }}
            </div>
            <div class="rating-col">{{ Math.round(entry.rating) }}</div>
            <div class="rd-col">{{ Math.round(entry.rd) }}</div>
            <div class="vol-col">{{ entry.vol.toFixed(4) }}</div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <p>No rating data for this variant yet</p>
        <p>Start playing to get a rating!</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.leaderboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.leaderboard-container h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.variant-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.variant-selector label {
  font-weight: bold;
  color: #555;
}

.variant-select {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
}

.variant-select:focus {
  outline: none;
  border-color: #007bff;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #dc3545;
}

.leaderboard-content h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.leaderboard-table {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px 120px;
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
  padding: 1rem;
  border-bottom: 2px solid #ddd;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px 120px;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.top-three {
  background-color: #fff3cd;
}

.table-row.top-three:hover {
  background-color: #ffeaa7;
}

.rank-col,
.username-col,
.rating-col,
.rd-col,
.vol-col {
  display: flex;
  align-items: center;
  padding: 0.5rem;
}

.rank-col {
  justify-content: center;
  font-weight: bold;
}

.username-col {
  font-weight: 500;
}

.rating-col {
  justify-content: center;
  font-weight: bold;
  color: #007bff;
}

.rd-col,
.vol-col {
  justify-content: center;
  font-family: monospace;
  color: #666;
}

@media (max-width: 768px) {
  .leaderboard-container {
    padding: 1rem;
  }

  .table-header,
  .table-row {
    grid-template-columns: 60px 1fr 80px 60px 80px;
    font-size: 0.9rem;
    padding: 0.75rem;
  }

  .variant-selector {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
