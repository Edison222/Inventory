'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #1976d2',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: '8px'
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  const addItem = async () => {
    if (!itemName.trim()) return
    const docRef = doc(collection(firestore, 'inventory'), itemName)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + itemQuantity })
    } else {
      await setDoc(docRef, { quantity: itemQuantity })
    }
    setItemName('')
    setItemQuantity(1)
    await updateInventory()
    handleClose()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const updateItem = async () => {
    const docRef = doc(collection(firestore, 'inventory'), editingItem.name)
    await setDoc(docRef, { quantity: itemQuantity })
    setEditingItem(null)
    setItemName('')
    setItemQuantity(1)
    await updateInventory()
    handleClose()
  }

  const editItem = (item) => {
    setEditingItem(item)
    setItemName(item.name)
    setItemQuantity(item.quantity)
    handleOpen()
  }

  const searchItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setSearchResult({ name: docSnap.id, ...docSnap.data() })
    } else {
      setSearchResult(null)
    }
  }

  const handleSearch = () => {
    searchItem(searchTerm)
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setEditingItem(null)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{ padding: 2, boxSizing: 'border-box', bgcolor: '#dcdcdc' }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editingItem ? 'Update Item' : 'Add Item'}
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-number"
              label="Quantity"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value))}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={editingItem ? updateItem : addItem}
            >
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} width="50%">
        <TextField
          id="search-item"
          label="Search Item"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Stack>
      {searchResult && (
        <Box
          width="50%"
          padding={2}
          marginTop={2}
          border="1px solid #1976d2"
          borderRadius="8px"
          bgcolor="#e3f2fd"
        >
          <Typography variant="h6">
            {searchResult.name.charAt(0).toUpperCase() + searchResult.name.slice(1)}
          </Typography>
          <Typography variant="body1">
            Quantity: {searchResult.quantity}
          </Typography>
        </Box>
      )}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={'1px solid #1976d2'} width="90%" maxWidth="800px" borderRadius="8px" overflow="hidden">
        <Box
          bgcolor="#00008b"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          padding={2}
        >
          <Typography variant={'h4'} color={'#fff'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" height="300px" spacing={2} overflow="auto" padding={2} sx={{ bgcolor: '#ffffff' }}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#e0e0e0'}
              padding={2}
              borderRadius="4px"
            >
              <Typography variant={'h5'} color={'#333'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h5'} color={'#333'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={() => editItem({ name, quantity })}>
                  Edit
                </Button>
                <Button variant="contained" sx={{ bgcolor: '#00008b' }} onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}