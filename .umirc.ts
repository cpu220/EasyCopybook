import { defineConfig } from "@umijs/max";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
  ],
  npmClient: 'yarn',
  model: { 
    CONTENT: './models/CONTENT',
  }
});
