# Places Setup Guide

## Map Technology

This project uses **Leaflet** with **OpenStreetMap** tiles - a completely **free** alternative to Google Maps that requires no API keys! Leaflet is one of the most popular open-source mapping libraries and is used by many major websites.

### Why Leaflet + OpenStreetMap?
- ✅ **Completely Free** - No API keys or usage limits
- ✅ **Widely Used** - Powers sites like Facebook, Pinterest, and many others
- ✅ **Feature Rich** - Custom markers, popups, and styling
- ✅ **No Setup Required** - Works immediately without configuration
- ✅ **Open Source** - Community-driven and constantly improving

## Photo Organization

### Folder Structure
Create the following folder structure in your project:
```
personal/places/
├── photos/
│   ├── paris/
│   │   ├── eiffel-tower.jpg
│   │   ├── montmartre.jpg
│   │   └── louvre.jpg
│   ├── tokyo/
│   │   ├── shibuya.jpg
│   │   ├── temple.jpg
│   │   └── sushi.jpg
│   ├── nyc/
│   │   ├── central-park.jpg
│   │   ├── brooklyn-bridge.jpg
│   │   └── times-square.jpg
│   └── barcelona/
│       ├── sagrada-familia.jpg
│       ├── park-guell.jpg
│       └── las-ramblas.jpg
└── playlists/
    ├── paris.m3u
    ├── tokyo.m3u
    ├── nyc.m3u
    └── barcelona.m3u
```

### Adding Your Photos
1. **Upload your photos** to the appropriate folders in `personal/places/photos/`
2. **Update the photo gallery** by modifying the `photos` array in `photo-gallery.html`
3. **Replace sample images** with paths to your actual photos

Example:
```javascript
const photos = [
    {
        src: "photos/paris/eiffel-tower.jpg",
        title: "Eiffel Tower at Sunset",
        description: "Golden hour in Paris"
    },
    // Add more photos...
];
```

## Music Integration

### Option 1: Spotify Playlists (Recommended)
1. **Create playlists** on Spotify for each location
2. **Get the playlist URLs** (Share → Copy Playlist Link)
3. **Update the `spotifyPlaylists` object** in `index.html`:

```javascript
const spotifyPlaylists = {
    'playlists/paris.m3u': 'https://open.spotify.com/playlist/YOUR_PARIS_PLAYLIST_ID',
    'playlists/tokyo.m3u': 'https://open.spotify.com/playlist/YOUR_TOKYO_PLAYLIST_ID',
    // Add more playlists...
};
```

### Option 2: Local Music Files
1. **Create playlist files** in the `personal/places/playlists/` folder
2. **Add your music files** or create `.m3u` playlist files
3. **Update the playlist paths** in the places data

## Customizing Places

### Adding New Places
1. **Open `personal/places/index.html`**
2. **Find the `places` array** in the JavaScript section
3. **Add your new place**:

```javascript
{
    name: "Rome, Italy",
    coords: [41.9028, 12.4964],
    date: "August 2024",
    description: "The Eternal City with its incredible history and architecture.",
    image: "https://your-image-url.com/rome.jpg", // or "photos/rome/preview.jpg"
    tags: ["History", "Architecture", "Food"],
    music: [
        "🎵 Volare - Dean Martin",
        "🎵 Roma Nun Fa' La Stupida Stasera - Gabriella Ferri"
    ],
    photos_folder: "photos/rome/",
    music_playlist: "playlists/rome.m3u"
}
```

### Updating Statistics
Don't forget to update the travel statistics in the `stats-container` section:
- Countries Visited
- Cities Explored
- Continents
- Photos Taken

## File Structure

Your organized file structure will look like this:
```
your-website/
├── main.html (links to personal/places/index.html)
├── styles.css
├── personal/
│   └── places/
│       ├── index.html (main places page)
│       ├── photo-gallery.html (photo viewer)
│       ├── SETUP.md (this file)
│       ├── photos/
│       │   ├── paris/
│       │   ├── tokyo/
│       │   └── ...
│       └── playlists/
│           ├── paris.m3u
│           ├── tokyo.m3u
│           └── ...
```

## Features

### Current Features
- ✅ Interactive Leaflet Maps with custom markers
- ✅ Detailed info windows with photos, descriptions, and music
- ✅ Clickable links to photo galleries and playlists
- ✅ Responsive design for mobile and desktop
- ✅ Dark/light theme support
- ✅ Photo gallery with modal viewer
- ✅ Organized folder structure

### Future Enhancements
- 📷 Automatic photo loading from folders
- 🎵 Embedded music players
- 🗺️ Route visualization between places
- 📱 Mobile app integration
- 🌐 Social media sharing
- 📊 Travel statistics and insights

## Troubleshooting

### Map Not Loading
- The map should load automatically since it uses free OpenStreetMap tiles
- Check browser console for any error messages
- Ensure you have an internet connection for the tiles to load

### Markers Not Appearing
- Check that the places array has valid latitude/longitude coordinates
- Verify the JavaScript console for any errors

### Photos Not Displaying
- Verify photo file paths are correct relative to the `personal/places/` folder
- Ensure photos are uploaded to the correct folders
- Check that image files are web-compatible (jpg, png, webp)

### Playlists Not Working
- Verify Spotify playlist URLs are public and correct
- Check that the `spotifyPlaylists` object is properly updated
- Ensure playlist IDs match the folder paths in your places data

### Navigation Issues
- Make sure all relative paths are updated for the new folder structure
- Check that the back links point to the correct files

## Support

If you need help setting up any of these features, feel free to ask for assistance!
