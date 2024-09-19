jQuery(document).ready(function($) {
    const testText = $('#test-text');
    const userInput = $('#user-input');
    const results = $('#results');
    const startButton = $('#start-test');
    const stopButton = $('#stop-test');
    const nextLevelButton = $('#next-level');
    const resetButton = $('#reset-test');
    const levelIndicator = $('#current-level');

    let startTime, endTime;
    let testActive = false;
    let currentSentenceIndex = 0;
    let currentLevel = 1;
    let testSentences = [];

    const sampleTexts = {
        1: [
            "The quick brown fox jumps over the lazy dog.",
            "Pack my box with five dozen liquor jugs.",
            "How vexingly quick daft zebras jump!",
            "Sphinx of black quartz, judge my vow.",
            "The five boxing wizards jump quickly."
        ],
        2: [
            "Jackdaws love my big sphinx of quartz.",
            "The jay, pig, fox, zebra and my wolves quack!",
            "A quick movement of the enemy will jeopardize six gunboats.",
            "Crazy Fredrick bought many very exquisite opal jewels.",
            "We promptly judged antique ivory buckles for the next prize."
        ],
        3: [
            "Waltz, nymph, for quick jigs vex Bud.",
            "Glib jocks quiz nymph to vex dwarf.",
            "Sphinx of black quartz, judge my vow.",
            "How vexingly quick daft zebras jump!",
            "The five boxing wizards jump quickly.",
            "Jackdaws love my big sphinx of quartz.",
            "Pack my box with five dozen liquor jugs.",
            "The quick onyx goblin jumps over the lazy dwarf.",
            "Cwm fjord bank glyphs vext quiz.",
            "How quickly daft jumping zebras vex."
        ]
    };

    let totalKeystrokes = 0;
    let correctKeystrokes = 0;

    let usedSentences = new Set();

    function getRandomSentences(level, count) {
        let availableSentences = sampleTexts[level].filter(sentence => !usedSentences.has(sentence));
        let selected = [];
        
        // If we don't have enough unique sentences, reset the used sentences for this level
        if (availableSentences.length < count) {
            usedSentences = new Set(usedSentences);
            sampleTexts[level].forEach(sentence => usedSentences.delete(sentence));
            availableSentences = sampleTexts[level];
        }
        
        while (selected.length < count) {
            if (availableSentences.length === 0) {
                // If we've used all sentences, start over for this level
                availableSentences = sampleTexts[level].filter(sentence => !selected.includes(sentence));
            }
            
            let index = Math.floor(Math.random() * availableSentences.length);
            selected.push(availableSentences[index]);
            usedSentences.add(availableSentences[index]);
            availableSentences.splice(index, 1);
        }
        
        return selected;
    }

    function startTest() {
        userInput.prop('disabled', false).val('').focus();
        testSentences = getRandomSentences(currentLevel, 5);
        currentSentenceIndex = 0;
        testText.text(testSentences[currentSentenceIndex]);
        results.empty();
        startTime = new Date().getTime();
        startButton.prop('disabled', true);
        stopButton.prop('disabled', false);
        nextLevelButton.hide();
        resetButton.hide();
        testActive = true;
        levelIndicator.text(currentLevel);
        totalKeystrokes = 0;
        correctKeystrokes = 0;
    }

    function stopTest() {
        if (!testActive) return;
        endTest();
    }

    function endTest() {
        endTime = new Date().getTime();
        userInput.prop('disabled', true);
        testActive = false;
        calculateResults();
        startButton.prop('disabled', false).text('Restart Level');
        stopButton.prop('disabled', true);
        if (currentLevel < 3) {
            nextLevelButton.show();
        }
        resetButton.show();
    }

    function calculateResults() {
        const timeElapsed = (endTime - startTime) / 1000; // in seconds
        const typedText = testSentences.join(' ');
        const words = typedText.split(/\s+/).length;
        const characters = typedText.length;
        const wpm = Math.round((words / timeElapsed) * 60);
        const accuracy = (correctKeystrokes / totalKeystrokes) * 100;

        results.html(`
            <h3>Level ${currentLevel} Results:</h3>
            <p>Words per minute: ${wpm}</p>
            <p>Accuracy: ${accuracy.toFixed(2)}%</p>
            <p>Time: ${timeElapsed.toFixed(2)} seconds</p>
        `);
    }

    function nextLevel() {
        if (currentLevel < 3) {
            currentLevel++;
            startTest();
        }
    }

    function resetTest() {
        currentLevel = 1;
        usedSentences.clear();
        startTest();
    }

    startButton.on('click', startTest);
    stopButton.on('click', stopTest);
    nextLevelButton.on('click', nextLevel);
    resetButton.on('click', resetTest);

    userInput.on('input', function(e) {
        if (!testActive) return;

        const originalText = testText.text();
        const typedText = userInput.val();

        // Increment total keystrokes
        totalKeystrokes++;

        // Check if the last keystroke was correct
        if (typedText[typedText.length - 1] === originalText[typedText.length - 1]) {
            correctKeystrokes++;
        }

        testText.html(originalText.split('').map((char, i) => {
            if (i < typedText.length) {
                return typedText[i] === char ? 
                    `<span class="correct">${char}</span>` : 
                    `<span class="incorrect">${char}</span>`;
            }
            return char;
        }).join(''));

        if (typedText === originalText) {
            currentSentenceIndex++;
            if (currentSentenceIndex < testSentences.length) {
                testText.text(testSentences[currentSentenceIndex]);
                userInput.val('');
            } else {
                endTest();
            }
        }
    });
});
