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
    (set) => ({
      databases: [],

      addDatabase: (database) => {
        const db = {
          id: Math.random().toString(36).substr(2, 9),
          ...database,
        }

        set((state) => ({
          databases: [...state.databases, db],
        }))
      },

      deleteDatabase: (id) => {
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
