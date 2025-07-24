import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCart = create(
  persist(
    (set) => ({
      cartItems: [],
      setCartItems: (items) => set({ cartItems: items }),
      clearCart: () => set({ cartItems: [] })
    }),
    {
      name: 'cart-storage', 
      getStorage: () => localStorage, 
    }
  )
)

export default useCart
