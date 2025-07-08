const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

const API_URL = "https://api.skymansion.site/movies-dl/search";
const DOWNLOAD_URL = "https://api.skymansion.site/movies-dl/download";
const API_KEY = config.MOVIE_API_KEY;

// Store pending movie selections in memory (for demo, not persistent)
const pendingSelections = {};

cmd({
    pattern: "movie",
    alias: ["moviedl", "films"],
    react: '🎬',
    category: "download",
    desc: "Search and download movies from PixelDrain (interactive)",
    filename: __filename
}, async (robin, m, mek, { from, q, reply, sender }) => {
    try {
        if (!q || q.trim() === '') return await reply('❌ Please provide a movie name! (e.g., Deadpool)');

        // Fetch movie search results
        const searchUrl = `${API_URL}?q=${encodeURIComponent(q)}&api_key=${API_KEY}`;
        let response = await fetchJson(searchUrl);

        if (!response || !response.SearchResult || !response.SearchResult.result.length) {
            return await reply(`❌ No results found for: *${q}*`);
        }

        // Show up to 5 results for user to pick
        const results = response.SearchResult.result.slice(0, 5);
        let msg = `> *🌀ONYX MD🔥MOVIE HUB🚀*\n\n🎬 *Movie Search Results for:* _${q}_\n\n`;
        results.forEach((movie, i) => {
            msg += `*${i + 1}.* ${movie.title} (${movie.year || 'N/A'})\n`;
        });
        msg += '\nඔබට අවශ්‍ය movie එකේ number එක *.moviepick <number>* ලෙස type කර send කරන්න🎞️';
        await robin.sendMessage(from, { text: msg }, { quoted: mek });

        // Store pending selection
        pendingSelections[from] = {
            results,
            user: sender,
            quotedId: mek.key.id,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Error in movie command:', error);
        await reply('❌ Sorry, something went wrong. Please try again later.');
    }
});

// Listen for replies to select a movie
cmd({
    pattern: /.*/,
    dontAddCommandList: true,
    filename: __filename
}, async (robin, m, mek, { from, body, sender }) => {
    // Only handle replies to movie search
    if (!pendingSelections[from]) return;
    const selection = pendingSelections[from];
    if (sender !== selection.user) return;
    // Accept reply if within 2 minutes of movie list message
    const now = Date.now();
    if (now - selection.timestamp > 2 * 60 * 1000) {
        delete pendingSelections[from];
        return;
    }
    // Accept if quoted or just a number in the chat
    const num = parseInt(body.trim());
    if (isNaN(num) || num < 1 || num > selection.results.length) return;
    const selectedMovie = selection.results[num - 1];
    delete pendingSelections[from];
    // React to the number reply
    await robin.sendMessage(from, { react: { text: '🎬', key: mek.key } });
    // Send downloading message
    await robin.sendMessage(from, { text: `⏬ Downloading your movie: *${selectedMovie.title}*...` }, { quoted: mek });
    try {
        const detailsUrl = `${DOWNLOAD_URL}/?id=${selectedMovie.id}&api_key=${API_KEY}`;
        let detailsResponse = await fetchJson(detailsUrl);
        if (!detailsResponse || !detailsResponse.downloadLinks || !detailsResponse.downloadLinks.result.links.driveLinks.length) {
            return await robin.sendMessage(from, { text: '❌ No download links found.' }, { quoted: mek });
        }
        // Try to find best quality: 720p > 1080p > 480p
        const links = detailsResponse.downloadLinks.result.links.driveLinks;
        let selectedDownload = links.find(link => link.quality === "HD 720p")
            || links.find(link => link.quality === "Full HD 1080p")
            || links.find(link => link.quality === "SD 480p");
        if (!selectedDownload || !selectedDownload.link.startsWith('http')) {
            return await robin.sendMessage(from, { text: '❌ No valid download link available.' }, { quoted: mek });
        }
        // Convert to direct download link
        const fileId = selectedDownload.link.split('/').pop();
        const directDownloadLink = `https://pixeldrain.com/api/file/${fileId}?download`;
        // Download movie (limit: 2.5GB)
        const filePath = path.join(__dirname, `${selectedMovie.title}-${selectedDownload.quality.replace(/\s/g, '')}.mp4`);
        const writer = fs.createWriteStream(filePath);
        const { data, headers } = await axios({
            url: directDownloadLink,
            method: 'GET',
            responseType: 'stream',
            timeout: 60000
        });
        const contentLength = parseInt(headers['content-length'] || '0');
        if (contentLength > 2500 * 1024 * 1024) {
            // Too large, send only the link
            await robin.sendMessage(from, { text: `🎬 *${selectedMovie.title}*\nQuality: ${selectedDownload.quality}\n\nDirect download link:\n${directDownloadLink}\n\n*Note:* File is too large to send directly. Use the link above.` }, { quoted: mek });
            return;
        }
        data.pipe(writer);
        writer.on('finish', async () => {
            await robin.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                fileName: `${selectedMovie.title}-${selectedDownload.quality.replace(/\s/g, '')}.mp4`,
                caption: `🎬 *${selectedMovie.title}*\n📌 Quality: ${selectedDownload.quality}\n✅ *Download Complete!*`,
                quoted: mek
            });
            fs.unlinkSync(filePath);
        });
        writer.on('error', async (err) => {
            console.error('Download Error:', err);
            await robin.sendMessage(from, { text: '❌ Failed to download movie. Please use the direct link above.' }, { quoted: mek });
        });
    } catch (error) {
        console.error('Error in movie selection:', error);
        await robin.sendMessage(from, { text: '❌ Sorry, something went wrong fetching the movie.' }, { quoted: mek });
    }
});

cmd({
    pattern: "moviepick",
    desc: "Pick a movie from the last search result",
    category: "download",
    filename: __filename
}, async (robin, m, mek, { from, body, sender, q }) => {
    // Only handle if there is a pending selection
    if (!pendingSelections[from]) return await robin.sendMessage(from, { text: '❌ No movie search in progress. Use .movie <name> first.' }, { quoted: mek });
    const selection = pendingSelections[from];
    if (sender !== selection.user) return await robin.sendMessage(from, { text: '❌ Only the user who searched can pick a movie.' }, { quoted: mek });
    const num = parseInt(q.trim());
    if (isNaN(num) || num < 1 || num > selection.results.length) return await robin.sendMessage(from, { text: '❌ Invalid number. Please pick a valid movie number from the list.' }, { quoted: mek });
    const selectedMovie = selection.results[num - 1];
    delete pendingSelections[from];
    // React to the command
    await robin.sendMessage(from, { react: { text: '🎬', key: mek.key } });
    // Send downloading message
    await robin.sendMessage(from, { text: `⏬ Downloading your movie: *${selectedMovie.title}*...` }, { quoted: mek });
    try {
        const detailsUrl = `${DOWNLOAD_URL}/?id=${selectedMovie.id}&api_key=${API_KEY}`;
        let detailsResponse = await fetchJson(detailsUrl);
        if (!detailsResponse || !detailsResponse.downloadLinks || !detailsResponse.downloadLinks.result.links.driveLinks.length) {
            return await robin.sendMessage(from, { text: '❌ No download links found.' }, { quoted: mek });
        }
        // Try to find best quality: 720p > 1080p > 480p
        const links = detailsResponse.downloadLinks.result.links.driveLinks;
        let selectedDownload = links.find(link => link.quality === "HD 720p")
            || links.find(link => link.quality === "Full HD 1080p")
            || links.find(link => link.quality === "SD 480p");
        if (!selectedDownload || !selectedDownload.link.startsWith('http')) {
            return await robin.sendMessage(from, { text: '❌ No valid download link available.' }, { quoted: mek });
        }
        // Convert to direct download link
        const fileId = selectedDownload.link.split('/').pop();
        const directDownloadLink = `https://pixeldrain.com/api/file/${fileId}?download`;
        // Download movie (limit: 2.5GB)
        const filePath = path.join(__dirname, `${selectedMovie.title}-${selectedDownload.quality.replace(/\s/g, '')}.mp4`);
        const writer = fs.createWriteStream(filePath);
        const { data, headers } = await axios({
            url: directDownloadLink,
            method: 'GET',
            responseType: 'stream',
            timeout: 60000
        });
        const contentLength = parseInt(headers['content-length'] || '0');
        if (contentLength > 2500 * 1024 * 1024) {
            // Too large, send only the link
            await robin.sendMessage(from, { text: `🎬 *${selectedMovie.title}*\nQuality: ${selectedDownload.quality}\n\nDirect download link:\n${directDownloadLink}\n\n*Note:* File is too large to send directly. Use the link above.` }, { quoted: mek });
            return;
        }
        data.pipe(writer);
        writer.on('finish', async () => {
            await robin.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                fileName: `${selectedMovie.title}-${selectedDownload.quality.replace(/\s/g, '')}.mp4`,
                caption: `🎬 *${selectedMovie.title}*\n📌 Quality: ${selectedDownload.quality}\n✅ *Download Complete!*`,
                quoted: mek
            });
            fs.unlinkSync(filePath);
        });
        writer.on('error', async (err) => {
            console.error('Download Error:', err);
            await robin.sendMessage(from, { text: '❌ Failed to download movie. Please use the direct link above.' }, { quoted: mek });
        });
    } catch (error) {
        console.error('Error in movie selection:', error);
        await robin.sendMessage(from, { text: '❌ Sorry, something went wrong fetching the movie.' }, { quoted: mek });
    }
});
