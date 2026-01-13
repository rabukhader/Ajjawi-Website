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
      const sortedBrands = [...data].sort((a, b) => {
        // If either brand is "اخرى", handle it separately
        const aIsOther = (a.name === 'اخرى' || a.name === 'أُخرى' || a.nameEnglish === 'Others');
        const bIsOther = (b.name === 'اخرى' || b.name === 'أُخرى' || b.nameEnglish === 'Others');
        
        if (aIsOther === bIsOther) {
          return (a.id || 0) - (b.id || 0);
        }
        
        return aIsOther ? 1 : -1;
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

