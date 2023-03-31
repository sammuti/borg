import Twit from 'twit';

// Set up your API keys and access tokens
const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
    access_token: process.env.TWITTER_ACCESS_TOKEN as string,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
    timeout_ms: 60 * 1000, // optional HTTP request timeout
    strictSSL: true, // optional - requires SSL certificates to be valid
});

// Post a tweet
export async function postTweet(status: string): Promise<Twit.PromiseResponse> {
    return T.post('statuses/update', { status });
}

// Get user tweets
export async function getUserTweets(username: string, count = 10): Promise<Twit.PromiseResponse> {
    return T.get('statuses/user_timeline', { screen_name: username, count });
}

// Search tweets
export async function searchTweets(query: string, count = 10): Promise<Twit.PromiseResponse> {
    return T.get('search/tweets', { q: query, count });
}