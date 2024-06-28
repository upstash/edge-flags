import { create } from "zustand"
import { persist } from "zustand/middleware"

type Database = {
  id: string

  url: string
  token: string
  tenant: string
  prefix: string
  saveToLocalStorage: boolean
}

type Store = {
  databases: Database[]

  addDatabase: (database: Omit<Database, "id">) => void
  deleteDatabase: (id: string) => void
}

export const useDatabaseStore = create(
  persist<Store>(
    (set, get) => ({
      databases: [],

      addDatabase: (database) => {
        if (get().databases.some((db) => db.url === database.url)) {
          throw new Error("Database with the same URL already exists")
        }

        const db = {
          id: Math.random().toString(36).slice(2, 9),
          ...database,
        }

        set((state) => ({
          databases: [...state.databases, db],
        }))
      },

      deleteDatabase: (id) => {
        if (!get().databases.some((db) => db.id === id)) {
          throw new Error("Database with the given ID does not exist")
        }

        set((state) => ({
          databases: state.databases.filter((db) => db.id !== id),
        }))
      },
    }),
    {
      name: "edge-flags",

      // Only save databases with `saveToLocalStorage` set to true
      getStorage: () => localStorage,
      partialize: (state) => ({
        ...state,
        databases: state.databases.filter((db) => db.saveToLocalStorage),
        customField: true,
      }),
    }
  )
)
