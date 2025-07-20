import { commons } from '../static/message.js';
import { shuffleArray, unsplash } from '../util/util.js';

const search = async (req, res, next) => {
    const { keyword } = req.query;
    const maxPages = 15;     // Try up to 15 pages (adjust as needed)
    const perPage = 10;      // Unsplash returns 10 per page for free plans
    const images = [];
    const seenUrls = new Set();
    const splitArrays = [];

    if (!keyword) {
        return res.status(400).json({
            message: commons.invalid_params,
            format: "keyword"
        });
    }

    try {
        for (let i = 1; i <= maxPages; i++) {
            console.log(`Fetching page ${i}...`);
            const result = await unsplash.search.getPhotos({
                query: keyword,
                page: i,
                perPage,
                orientation: 'landscape'
            });

            const resultsArray = result.response.results;
            console.log(`Fetched ${resultsArray.length} images from page ${i}`);

            resultsArray.forEach(each => {
                const imgUrl = each.urls.raw;
                const normalizedUrl = imgUrl.split('?')[0];

                if (!seenUrls.has(normalizedUrl)) {
                    seenUrls.add(normalizedUrl);
                    images.push({
                        id: normalizedUrl,
                        url: imgUrl
                    });
                }
            });

            if (images.length >= 64) {
                console.log("Got 64+ unique images, stopping early.");
                break;
            }
        }

        console.log(`Total unique images collected: ${images.length}`);

        shuffleArray(images);

        const limitedImages = images.slice(0, 64);

        for (let i = 0; i < limitedImages.length; i += 16) {
            splitArrays.push(limitedImages.slice(i, i + 16));
        }

        return res.send(splitArrays);

    } catch (err) {
        console.error("Error fetching images:", err);
        return res.status(500).json({ message: 'Something went wrong while fetching images.' });
    }
};

export { search };
