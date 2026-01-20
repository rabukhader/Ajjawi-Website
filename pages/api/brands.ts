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
    const response = await fetch(`${API_BASE_URL}/api/brands`, {
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
    
    if (Array.isArray(data)) {
      const getSortOrder = (id: number | string | undefined): number => {
        const idNum = typeof id === 'string' ? parseInt(id, 10) : (id || 0);
        
        if (idNum === 2) return 1;
        if (idNum === 1) return 2;
        if (idNum === 3) return 3;
        if (idNum === 4) return 4;
        if (idNum === 5) return 5;
        if (idNum === 14) return 9999;
        
        return 100 + idNum;
      };
      
      const sortedBrands = [...data].sort((a, b) => {
        const aOrder = getSortOrder(a.id);
        const bOrder = getSortOrder(b.id);
        return aOrder - bOrder;
      });
      
      res.status(200).json(sortedBrands);
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ 
      message: 'Failed to fetch brands',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

