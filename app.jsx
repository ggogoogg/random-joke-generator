const { useState, useEffect } = React;

const JokeGenerator = () => {
    const [joke, setJoke] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [jokeCount, setJokeCount] = useState(0);

    // Joke APIs
    const APIs = [
        {
            name: 'JokeAPI',
            url: 'https://v2.jokeapi.dev/joke/Any',
            parse: (data) => {
                if (data.type === 'single') {
                    return { text: data.joke, source: 'JokeAPI' };
                }
                return {
                    text: data.setup,
                    punchline: data.delivery,
                    source: 'JokeAPI'
                };
            }
        },
        {
            name: 'Official Joke API',
            url: 'https://official-joke-api.appspot.com/random_joke',
            parse: (data) => ({
                text: data.setup,
                punchline: data.punchline,
                source: 'Official Joke API'
            })
        },
        {
            name: 'Programming Jokes',
            url: 'https://official-joke-api.appspot.com/jokes/programming/random',
            parse: (data) => ({
                text: data[0].setup,
                punchline: data[0].punchline,
                source: 'Programming Jokes'
            })
        }
    ];

    const fetchJoke = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Pick random API
            const randomAPI = APIs[Math.floor(Math.random() * APIs.length)];
            
            const response = await fetch(randomAPI.url);
            if (!response.ok) throw new Error('Failed to fetch joke');
            
            const data = await response.json();
            const parsedJoke = randomAPI.parse(data);
            
            setJoke(parsedJoke);
            setJokeCount(jokeCount + 1);
        } catch (err) {
            setError('Oops! Could not load a joke. Try again!');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJoke();
    }, []);

    const copyToClipboard = () => {
        if (joke) {
            const text = joke.punchline 
                ? `${joke.text} ${joke.punchline}` 
                : joke.text;
            navigator.clipboard.writeText(text);
            alert('Joke copied to clipboard!');
        }
    };

    return (
        <div className="joke-card bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                    😂 Joke Generator
                </h1>
                <p className="text-gray-600 text-sm">Jokes loaded: {jokeCount}</p>
            </div>

            {/* Joke Display */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 mb-8 min-h-48 flex flex-col justify-center">
                {loading ? (
                    <div className="loading text-center">
                        <div className="text-5xl mb-4">🤔</div>
                        <p className="text-gray-600 text-lg">Loading a funny joke...</p>
                    </div>
                ) : error ? (
                    <div className="text-center">
                        <div className="text-5xl mb-4">😅</div>
                        <p className="text-red-500 font-semibold">{error}</p>
                    </div>
                ) : joke ? (
                    <div>
                        <p className="joke-text text-gray-800 mb-4">{joke.text}</p>
                        {joke.punchline && (
                            <p className="punchline text-pink-600">{joke.punchline}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-6">Source: {joke.source}</p>
                    </div>
                ) : null}
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={fetchJoke}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '⏳ Loading...' : '🎲 Get Another Joke'}
                </button>
                <button
                    onClick={copyToClipboard}
                    disabled={!joke || loading}
                    className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    📋 Copy
                </button>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-gray-500 text-sm">
                <p>Using multiple joke APIs for variety!</p>
            </div>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<JokeGenerator />);