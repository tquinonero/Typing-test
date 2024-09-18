jQuery(document).ready(function($) {
    const testText = $('#test-text');
    const userInput = $('#user-input');
    const results = $('#results');
    const startButton = $('#start-test');
    const stopButton = $('#stop-test');

    let startTime, endTime;
    let testActive = false;
    let currentSentenceIndex = 0;
    let testSentences = [];

    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog.",
        "Pack my box with five dozen liquor jugs.",
        "How vexingly quick daft zebras jump!",
        "Sphinx of black quartz, judge my vow.",
        "The five boxing wizards jump quickly.",
        "Jackdaws love my big sphinx of quartz.",
        "The jay, pig, fox, zebra and my wolves quack!",
        "A quick movement of the enemy will jeopardize six gunboats.",
        "Crazy Fredrick bought many very exquisite opal jewels.",
        "We promptly judged antique ivory buckles for the next prize."
    ];

    function getRandomSentences(count) {
        let sentences = [];
        let usedIndexes = new Set();
        
        while (sentences.length < count) {
            let index = Math.floor(Math.random() * sampleTexts.length);
            if (!usedIndexes.has(index)) {
                sentences.push(sampleTexts[index]);
                usedIndexes.add(index);
            }
        }
        
        return sentences;
    }

    function startTest() {
        userInput.prop('disabled', false).val('').focus();
        testSentences = getRandomSentences(5);
        currentSentenceIndex = 0;
        testText.text(testSentences[currentSentenceIndex]);
        results.empty();
        startTime = new Date().getTime();
        startButton.prop('disabled', true);
        stopButton.prop('disabled', false);
        testActive = true;
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
        startButton.prop('disabled', false).text('Restart Test');
        stopButton.prop('disabled', true);
    }

    function calculateResults() {
        const timeElapsed = (endTime - startTime) / 1000; // in seconds
        const typedText = testSentences.join(' ');
        const words = typedText.split(/\s+/).length;
        const characters = typedText.length;
        const wpm = Math.round((words / timeElapsed) * 60);
        const accuracy = 100; // Since we only move to next sentence when correct, accuracy is always 100%

        results.html(`
            <h3>Results:</h3>
            <p>Words per minute: ${wpm}</p>
            <p>Accuracy: ${accuracy.toFixed(2)}%</p>
            <p>Time: ${timeElapsed.toFixed(2)} seconds</p>
        `);
    }

    startButton.on('click', startTest);
    stopButton.on('click', stopTest);

    userInput.on('input', function() {
        if (!testActive) return;

        const originalText = testText.text();
        const typedText = userInput.val();

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
