import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import { moods, type Mood } from './data/moods';

interface MoodEntry {
  mood: Mood;
  date: string;
  note: string;
}

function App() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('pokemonMoodHistory');
    const savedCurrentStreak = localStorage.getItem('currentStreak');
    const savedLongestStreak = localStorage.getItem('longestStreak');

    if (savedHistory) {
      setMoodHistory(JSON.parse(savedHistory));
    }
    if (savedCurrentStreak) {
      setCurrentStreak(parseInt(savedCurrentStreak));
    }
    if (savedLongestStreak) {
      setLongestStreak(parseInt(savedLongestStreak));
    }
  }, []);

  // Calculate streaks
  const calculateStreaks = (history: MoodEntry[]) => {
    if (history.length === 0) return { current: 0, longest: 0 };

    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    // Check if user logged today or yesterday to continue streak
    const hasLoggedToday = sortedHistory.some(entry => entry.date === today);
    const hasLoggedYesterday = sortedHistory.some(entry => entry.date === yesterday);

    if (hasLoggedToday || hasLoggedYesterday) {
      const uniqueDates = Array.from(new Set(sortedHistory.map(entry => entry.date))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      for (let i = 0; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (currentDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          current++;
        } else {
          break;
        }
      }

      // Calculate longest streak
      tempStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const dayDiff = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);

        if (dayDiff === 1) {
          tempStreak++;
          longest = Math.max(longest, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
      longest = Math.max(longest, tempStreak, current);
    }

    return { current, longest };
  };

  const handleMoodSelect = useCallback((mood: Mood) => {
    setSelectedMood(mood);
  }, []);

  const saveMoodEntry = useCallback(() => {
    if (selectedMood) {
      const entry: MoodEntry = {
        mood: selectedMood,
        date: new Date().toISOString().split('T')[0],
        note: currentNote
      };

      const newHistory = [...moodHistory, entry];
      setMoodHistory(newHistory);

      // Calculate and update streaks
      const streaks = calculateStreaks(newHistory);
      setCurrentStreak(streaks.current);
      setLongestStreak(streaks.longest);

      // Save to localStorage (debounced to avoid excessive writes)
      setTimeout(() => {
        localStorage.setItem('pokemonMoodHistory', JSON.stringify(newHistory));
        localStorage.setItem('currentStreak', streaks.current.toString());
        localStorage.setItem('longestStreak', streaks.longest.toString());
      }, 100);

      setSelectedMood(null);
      setCurrentNote('');
    }
  }, [selectedMood, currentNote, moodHistory]);

  const todaysEntry = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return moodHistory.find(entry => entry.date === today);
  }, [moodHistory]);

  const weeklyStats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyEntries = moodHistory.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );

    const moodCounts: Record<string, number> = {};
    weeklyEntries.forEach(entry => {
      moodCounts[entry.mood.name] = (moodCounts[entry.mood.name] || 0) + 1;
    });

    const moodEntries = Object.entries(moodCounts);
    const mostCommonMood = moodEntries.length > 0 
      ? moodEntries.reduce((max, current) => current[1] > max[1] ? current : max)
      : null;

    return {
      totalEntries: weeklyEntries.length,
      mostCommonMood: mostCommonMood ? mostCommonMood[0] : 'None',
      uniqueDays: Array.from(new Set(weeklyEntries.map(entry => entry.date))).length
    };
  }, [moodHistory]);

  return (
    <div className="App">
      <div className="floating-decorations">
        <div className="floating-heart">🍃</div>
        <div className="floating-star">🌟</div>
        <div className="floating-sparkle">✨</div>
        <div className="floating-flower">🌸</div>
        <div className="floating-rainbow">🦋</div>
      </div>
      <header className="App-header">
        <h1>✦ Mewd ✦</h1>
        <p>Discover your emotions with magical companions</p>

        {/* Daily Tracker Stats */}
        <div className="daily-stats">
          <div className="stat-card">
            <div className="stat-number">{currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{longestStreak}</div>
            <div className="stat-label">Longest Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{weeklyStats.uniqueDays}/7</div>
            <div className="stat-label">This Week</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{moodHistory.length}</div>
            <div className="stat-label">Total Entries</div>
          </div>
        </div>

        {todaysEntry && (
          <div className="todays-mood">
            <p>✨ Today's mood: <strong>{todaysEntry.mood.name}</strong> with {todaysEntry.mood.pokemon}!</p>
          </div>
        )}
      </header>
      <main className="mood-tracker">
        <div className="mood-selection">
          <h2>{todaysEntry ? "Update Today's Mood" : "How are you feeling today?"}</h2>
          <div className="mood-grid">
            {moods.map((mood) => (
              <button
                key={mood.id}
                className="mood-card"
                data-mood={mood.name}
                onClick={() => handleMoodSelect(mood)}
                style={{ borderColor: mood.color }}
              >
                <img 
                  src={mood.imageUrl} 
                  alt={mood.pokemon}
                  className="pokemon-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiNGNEY0RjQiLz4KPHN2ZyB4PSIyNCIgeT0iMjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHA+Zm9sZGVyIG9wZW4gPHNwYW4gaWQ9ImVtb2ppIj7wn5OHPC9zcGFuPjwvcD4KPHN2Zz4='
                  }}
                />
                <div className="mood-name">{mood.name}</div>
                <div className="mood-pokemon">{mood.pokemon}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedMood && (
          <div className="mood-entry">
            <div className="selected-mood-display">
              <img 
                src={selectedMood.imageUrl} 
                alt={selectedMood.pokemon}
                className="selected-pokemon-image"
              />
              <div>
                <h3>You selected: {selectedMood.name}</h3>
                <p>with your companion {selectedMood.pokemon}!</p>
              </div>
            </div>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Add a note about your mood and what happened today..."
              rows={4}
            />
            <button onClick={saveMoodEntry} className="save-button">
              {todaysEntry ? "Update Today's Entry" : "Save Mood Entry"}
            </button>
          </div>
        )}

        {moodHistory.length > 0 && (
          <div className="mood-history">
            <h3>Your Mood Journey</h3>
            <div className="weekly-summary">
              <p>This week's favorite mood: <strong>{weeklyStats.mostCommonMood}</strong></p>
            </div>
            <div className="history-list">
              {moodHistory.slice(-10).reverse().map((entry, index) => (
                <div key={index} className="history-entry">
                  <img 
                    src={entry.mood.imageUrl} 
                    alt={entry.mood.pokemon}
                    className="history-pokemon-image"
                  />
                  <div className="history-content">
                    <div className="history-header">
                      <span className="history-date">{new Date(entry.date).toLocaleDateString()}</span>
                      <span className="history-mood" style={{ color: entry.mood.color }}>
                        {entry.mood.name} with {entry.mood.pokemon}
                      </span>
                    </div>
                    {entry.note && <span className="history-note">"{entry.note}"</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;