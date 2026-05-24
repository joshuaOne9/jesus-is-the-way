import { useNodesState, useEdgesState } from 'reactflow'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

import { BEINGS, CATEGORIES, CATEGORY_COLORS } from '../data/beings'
import { RELATIONSHIPS, RELATIONSHIP_STYLES } from '../data/relationships'

// Layout constants
const COLUMN_WIDTH = 220
const ROW_HEIGHT = 70
const COLUMN_START_X = 50
const COLUMN_START_Y = 50

// Generate one node per being, clustered into columns by category
function generateNodes() {
    const nodes = []

    CATEGORIES.forEach((category, columnIndex) => {
        const beingsInCategory = BEINGS.filter((b) => b.category === category)

        beingsInCategory.forEach((being, rowIndex) => {
            nodes.push({
                id: being.name,
                position: {
                    x: COLUMN_START_X + columnIndex * COLUMN_WIDTH,
                    y: COLUMN_START_Y + rowIndex * ROW_HEIGHT,
                },
                data: { label: being.name },
                style: {
                    background: CATEGORY_COLORS[category],
                    color: '#0b0b14',
                    border: '1px solid #0b0b14',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '8px 12px',
                    width: 180,
                },
            })
        })
    })

    return nodes
}

// Generate one edge per relationship, styled by type
function generateEdges() {
    return RELATIONSHIPS.map((rel, idx) => {
        const style = RELATIONSHIP_STYLES[rel.type] || {}
        return {
            id: `e-${idx}`,
            source: rel.from,
            target: rel.to,
            label: style.label || rel.type,
            animated: style.animated || false,
            style: {
                stroke: style.stroke || '#9ca3af',
                strokeWidth: style.strokeWidth || 1.5,
                strokeDasharray: style.strokeDasharray || undefined,
            },
            labelStyle: { fontSize: 10, fill: '#e5e7eb', fontWeight: 600 },
            labelBgStyle: { fill: '#0b0b14', fillOpacity: 0.85 },
            labelBgPadding: [4, 4],
        }
    })
}

function RealmGraph({ onBeingClick}) {
    const [nodes, , onNodesChange] = useNodesState(generateNodes())
    const [edges] = useEdgesState(generateEdges())
    const handleNodeClick = (event, node) => {
        const being = BEINGS.find((b) => b.name === node.id)
        if (being && onBeingClick) {
            onBeingClick(being)
        }
    }

    return (
        <div style={{ width: '100%', height: '600px', background: '#0b0b14', borderRadius: '8px' }}>
            <ReactFlow nodes={nodes}
                       edges={edges}
                       onNodesChange={onNodesChange}
                       onNodeClick={handleNodeClick}
                       fitView
                    >
                <Background color="#2a2a40" gap={20} />
                <Controls />
                <MiniMap
                    nodeColor={(node) => node.style?.background || '#c9a84c'}
                    maskColor="rgba(11, 11, 20, 0.85)"
                />
            </ReactFlow>
        </div>
    )
}

export default RealmGraph