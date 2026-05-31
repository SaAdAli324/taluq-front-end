import { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

// 1. Initialize the API with your key 
// (Best practice: store this in your .env file!)

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);

const GiphyPicker = ({ onSendSticker }: { onSendSticker: (url: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Create the fetch function that the Grid will use
  const fetchGifs = (offset: number) => {
    if (searchTerm) {
      // Search for stickers specifically (not standard rectangular GIFs)
      return gf.search(searchTerm, { offset, limit: 15, type: 'stickers' });
    }
    // Default view when they open it
    return gf.trending({ offset, limit: 15, type: 'stickers' });
  };

  return (
    <div className="relative h-96 w-xs z-50 bg-white border border-gray-200 shadow-xl rounded-xl p-2 flex flex-col gap-2 overflow-hidden">
      
      {/* 3. Search Bar inside the picker */}
      <input 
        type="text"
        placeholder="Search stickers..."
        className="w-full px-3 py-2 bg-gray-100 rounded-lg outline-none text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 4. The Giphy Grid */}
      <div className="absolute bottom-0 left-0 w-full h-full flex-1 overflow-y-auto overflow-x-hidden">
        <Grid 
          // Changing the key forces the Grid to reset when the search term changes
          key={searchTerm} 
          width={300} 
          columns={3} 
          fetchGifs={fetchGifs} 
          onGifClick={(gif, e) => {
            e.preventDefault();
            
            // 5. Extract the actual image URL and send it!
            const gifUrl = gif.images.original.url;
            onSendSticker(gifUrl);

          }}
        />
      </div>
    </div>
  );
};

export default GiphyPicker;