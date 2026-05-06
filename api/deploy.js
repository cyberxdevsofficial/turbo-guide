export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, content } = req.body;

        if (!name || !content) {
            return res.status(400).json({ error: 'Missing name or content' });
        }

        // Call Vercel API securely from backend
        const response = await fetch('https://api.vercel.com/v13/deployments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer vcp_2I2124PuAUwewd2B78ELbnHBCZUJyWJ3byqHE3vsCGm87YBGK13bWcl0`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                files: [
                    {
                        file: 'index.html',
                        data: Buffer.from(content).toString('base64'),
                        encoding: 'base64'
                    }
                ],
                projectSettings: { framework: null }
            })
        });

        const data = await response.json();

        // Handle Vercel errors
        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || 'Vercel deployment failed'
            });
        }

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({
            error: 'Server error',
            message: err.message
        });
    }
}
