export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { question } = req.body

    if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid question' })
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5',
                max_tokens: 1024,
                system: 'You are a knowledgable Christian biblical scholar and theologian. Answer questions about Christianity, Jesus, the Bible (canonical and non-canonical), biblical theology, demonology, angelology, chruch history, and comparative religion with scholary accuracy, depth, and reverence. Be informative, gracious, and clear. Aim for 150-250 words per response.',
                messages: [
                    { role: 'user', content: question }
                ]
            })
            })

            const data = await response.json()

            if (data.error) {
                return res.status(500).json({ error: data.error.message || 'Anthropic API error'})
            }

            const text = data.content?.[0]?.text || 'No response received.'
            return res.status(200).json({ answer: text})
        } catch (err) {
            console.error('API call failed:', err)
            return res.status(500).json({ error: 'Something went wrong.'})
        }
    }