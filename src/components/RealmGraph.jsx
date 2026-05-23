import { useState } from 'react'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

const INITIAL_NODES = [
    {
        id: '1',
        position: { x: 100, y: 100 },
        data: { label: 'Shemyaza' },
    },
    {
        id: '2',
        position: { x: 350, y: 100},
        data: { label: 'Azazel' },
    },
    {
        id: '3',
        position: { x: 600, y: 100},
        data: {label: 'Penemue' },
    },
]

const INITIAL_EDGES = [
    { id: 'e1-2', source: '1', target: '2', label: 'led' },
    { id: 'e1-3', source: '1', target: '3', label: 'led' },
]

function RealmGraph() {
    const [nodes] = useState(INITIAL_NODES)
    const [edges] = useState(INITIAL_EDGES)

    return (
        <div style={{ width: '100%', height: '600px', background: '#0b0b14', borderRadius: '8px' }}>
            <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background color="#2a2a40" gap={20} />
                <Controls />
                <MiniMap nodeColor="#c9a84c" maskColor="rgba(11, 11, 20, 0.85)" />
            </ReactFlow>
        </div>
    )
}

export default RealmGraph