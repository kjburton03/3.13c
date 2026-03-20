import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import Home from "../pages/Home"
import { RockForm } from "./RockForm.jsx"
import { RockList } from "./RockList.jsx"
import { Register } from '../pages/Register.jsx'


export const ApplicationViews = () => {
    const [rocksState, setRocksState] = useState([{
        id: 1,
        name: "Sample",
        type: {
            id: 1,
            label: "Volcanic"
        }
    }])
    const [typesState, setTypesState] = useState([])

    const authHeaders = {
        Authorization: `Token ${JSON.parse(localStorage.getItem("rock_token")).token}`
    }

    const fetchTypes = async () => {
        const response = await fetch("http://localhost:8000/types", {
            headers: authHeaders
        })
        const types = await response.json()
        setTypesState(types)

        return types
    }

    const fetchRocksFromAPI = async (types = typesState) => {
        const response = await fetch("http://localhost:8000/rocks", {
            headers: authHeaders
        })
        const rocks = await response.json()

        const rocksWithTypes = rocks.map(rock => ({
            ...rock,
            type: types.find(t => t.id === rock.type_id)
        }))

        setRocksState(rocksWithTypes)
    }

    useEffect(() => {
        const loadData = async () => {
            const types = await fetchTypes()
            await fetchRocksFromAPI(types)
        }

        loadData()
    }, [])

    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Authorized />}>
                <Route path="/" element={<Home />} />
                <Route path="/allrocks" element={<RockList rocks={rocksState} fetchRocks={fetchRocksFromAPI} />} />
                <Route path="/create" element={<RockForm fetchRocks={fetchRocksFromAPI} />} />
                <Route path="/mine" element={<RockList rocks={rocksState} fetchRocks={fetchRocksFromAPI} />} />
            </Route>
        </Routes>
    </BrowserRouter>
}
