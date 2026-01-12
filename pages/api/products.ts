import type { NextApiRequest, NextApiResponse } from 'next';

const API_BASE_URL = 'https://ajjawe.ps';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { brandId } = req.query;
    let url = `${API_BASE_URL}/api/products`;
    
    if (brandId) {
      url += `?brandId=${brandId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

