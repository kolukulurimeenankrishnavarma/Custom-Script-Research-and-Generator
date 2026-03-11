document.addEventListener('DOMContentLoaded', () => {
    // Basic Inputs
    const inputSection = document.getElementById('inputSection');
    const form = document.getElementById('scriptForm');
    const topicInput = document.getElementById('topicInput');
    const durationInput = document.getElementById('durationInput');
    
    // New Inputs
    const nicheInput = document.getElementById('nicheInput');
    const contentStyleInput = document.getElementById('contentStyleInput');
    const toneInput = document.getElementById('toneInput');
    const contentTypeInput = document.getElementById('contentTypeInput');
    const animationInput = document.getElementById('animationInput');
    const hookToggle = document.getElementById('hookToggle');
    const seoToggle = document.getElementById('seoToggle');

    // UI Elements
    const progressSection = document.getElementById('progressSection');
    const progressSubtitle = document.getElementById('progressSubtitle');
    const progressBar = document.getElementById('progressBar');
    const progressLog = document.getElementById('progressLog');
    
    const outputSection = document.getElementById('outputSection');
    const outputTopic = document.getElementById('outputTopic');
    const metaDuration = document.getElementById('metaDuration');
    const scriptContent = document.getElementById('scriptContent');
    const resetBtn = document.getElementById('resetBtn');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const historyGrid = document.getElementById('historyGrid');

    let currentScriptText = "";
    let scriptHistory = JSON.parse(localStorage.getItem('yt_script_history') || '[]');

    // Initialize History
    renderHistory();

    // Simulated Deep Research Steps
    const researchSteps = [
        "Initializing autonomous agent...",
        "Querying academic databases and credible sources...",
        "Cross-referencing factual data...",
        "Extracting key concepts...",
        "Applying niche-specific narrative frameworks...",
        "Adjusting linguistic tone and vocabulary...",
        "Structuring narrative flow (Hook, Body, CTA)...",
        "Synthesizing visual direction and cues...",
        "Finalizing formatting..."
    ];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const options = {
            topic: topicInput.value.trim(),
            duration: durationInput.value,
            niche: nicheInput.value,
            contentStyle: contentStyleInput.value,
            tone: toneInput.value,
            contentType: contentTypeInput.value,
            animations: animationInput.value,
            includeHook: hookToggle.checked,
            includeSEO: seoToggle.checked
        };

        if(!options.topic || !options.duration) return;

        // Hide input, show progress
        inputSection.classList.add('hidden');
        progressSection.classList.remove('hidden');

        // Reset progress UI
        progressBar.style.width = '0%';
        progressLog.innerHTML = '';
        
        await runResearchSimulation();

        // Generate Script
        const generatedHtml = generateScriptLogic(options);

        // Save to History
        saveToHistory({
            id: Date.now(),
            topic: options.topic,
            date: new Date().toLocaleDateString(),
            html: generatedHtml,
            options: options
        });

        displayOutput(options.topic, options.duration, generatedHtml);
    });

    function displayOutput(topic, duration, html) {
        progressSection.classList.add('hidden');
        outputSection.classList.remove('hidden');
        
        outputTopic.textContent = topic;
        metaDuration.textContent = `Estimated duration: ${getDurationLabel(duration)}`;
        scriptContent.innerHTML = html;
        currentScriptText = extractTextFromHtml(html);
        window.scrollTo(0, 0);
    }

    resetBtn.addEventListener('click', () => {
        outputSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        form.reset();
        window.scrollTo(0, 0);
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentScriptText).then(() => {
            copyText.textContent = "Copied!";
            copyBtn.classList.add('btn-success');
            setTimeout(() => {
                copyText.textContent = "Copy";
                copyBtn.classList.remove('btn-success');
            }, 2000);
        });
    });

    async function runResearchSimulation() {
        return new Promise((resolve) => {
            let currentStep = 0;
            const totalTime = 4000; 
            const stepTime = totalTime / researchSteps.length;

            const interval = setInterval(() => {
                if(currentStep >= researchSteps.length) {
                    clearInterval(interval);
                    progressBar.style.width = '100%';
                    progressSubtitle.textContent = "Research Complete. Script generated.";
                    setTimeout(resolve, 500); 
                    return;
                }

                const li = document.createElement('li');
                li.innerHTML = `> [${new Date().toLocaleTimeString()}] ${researchSteps[currentStep]}`;
                progressLog.appendChild(li);
                progressLog.scrollTop = progressLog.scrollHeight;
                progressSubtitle.textContent = researchSteps[currentStep];
                progressBar.style.width = `${(currentStep / researchSteps.length) * 100}%`;
                currentStep++;
            }, stepTime);
        });
    }

    function getDurationLabel(dur) {
        if(dur === 'short') return "3-5 Minutes (approx 600-800 words)";
        if(dur === 'medium') return "8-12 Minutes (approx 1500-1800 words)";
        return "15-20 Minutes (approx 2500+ words)";
    }

    function generateScriptLogic(opt) {
        let segmentCount = 2; 
        if(opt.duration === 'medium') segmentCount = 4;
        if(opt.duration === 'long') segmentCount = 6;

        let html = ``;
        
        // SEO SECTION
        if(opt.includeSEO) {
            html += `<div class="visual-cue"><strong>SEO & METADATA:</strong><br>
            Primary Keyword: ${opt.topic}<br>
            Secondary Keywords: ${opt.niche}, ${opt.topic} explained, ${opt.topic} guide<br>
            Recommended Title Idea: The Secret Logic of ${opt.topic}: A Complete Guide</div>`;
        }

        html += `<h2>Script: ${opt.topic}</h2>`;
        
        // MUSIC CUE
        const musicStyle = opt.tone === 'serious' ? 'Cinematic and heavy' : (opt.tone === 'humorous' ? 'Quirky and lighthearted' : 'Upbeat and energetic');
        html += `<div class="audio-cue">[MUSIC: ${musicStyle}. Building momentum from the first second.]</div>`;
        
        // HOOK
        if(opt.includeHook) {
            html += `<h3>Chapter 1: The Hook (0:00 - 1:00)</h3>`;
            const hookVisual = opt.animations === 'detailed' ? 
                `[ANIMATION PROMPT: A hyper-realistic slow motion tracking shot of an object representing ${opt.topic}, glowing with neon energy, 8k resolution, cinematic lighting.]` : 
                `[SCENE START] Rapid montage: High quality footage relating to ${opt.topic}.`;
            
            html += `<div class="visual-cue">${hookVisual}</div>`;
            
            if(opt.tone === 'serious') {
                html += `<p><strong>HOST:</strong> We live in an era defined by ${opt.topic}. But behind the surface lies a complexity that most ignore. Today, we reveal that truth.</p>`;
            } else if(opt.tone === 'humorous') {
                html += `<p><strong>HOST:</strong> Look, let's be real. ${opt.topic} sounds like something that would make your brain melt. But don't worry, I've got the liquid nitrogen ready. Let's dive in.</p>`;
            } else {
                html += `<p><strong>HOST:</strong> Have you ever wondered how ${opt.topic} actually works? It’s everywhere, yet it’s one of the biggest mysteries of our daily lives.</p>`;
            }
        }

        // BODY SEGMENTS
        for(let i = 1; i <= segmentCount; i++) {
            html += `<h3>Chapter ${i+1}: Segment ${i}</h3>`;
            const bodyVisual = opt.animations === 'detailed' ? 
                `[ANIMATION PROMPT: A wide shot of a futuristic data-driven landscape representing the ${opt.niche} aspects of ${opt.topic}. Digital particles floating in 3D space.]` : 
                `[B-ROLL] Kinetic typography animation highlighting key concepts of ${opt.topic}.`;
            
            html += `<div class="visual-cue">${bodyVisual}</div>`;
            
            const speaker = opt.contentType === 'faceless' ? 'NARRATOR' : 'HOST';
            html += `<p><strong>${speaker}:</strong> Let's break down the ${opt.niche} perspective from an ${opt.contentStyle} angle. In the world of ${opt.niche}, ${opt.topic} isn't just a concept—it's a tool. This style of ${opt.contentStyle} allows us to see how it really fits into the bigger picture.</p>`;
            html += `<div class="audio-cue">[SFX: Subtle digital pulse]</div>`;
            html += `<p><strong>${speaker}:</strong> The reason this matters for anyone interested in ${opt.niche} is simple. If you take away the noise, what you're left with is a fundamental principle that drives everything.</p>`;
        }

        // OUTRO
        html += `<h3>Final Chapter: Conclusion</h3>`;
        html += `<p><strong>HOST:</strong> So, the next time you encounter ${opt.topic}, you'll see the patterns. You'll understand the logic through this ${opt.contentStyle} lens.</p>`;
        html += `<p><strong>HOST:</strong> If you found this ${opt.niche} ${opt.contentStyle} helpful, hit that like button. And for more deep dives into ${opt.topic} and beyond, make sure to subscribe.</p>`;

        return html;
    }

    function extractTextFromHtml(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
    }

    // History Logic
    function saveToHistory(item) {
        scriptHistory.unshift(item);
        if(scriptHistory.length > 3) scriptHistory.pop();
        localStorage.setItem('yt_script_history', JSON.stringify(scriptHistory));
        renderHistory();
    }

    function renderHistory() {
        if(scriptHistory.length === 0) {
            historyGrid.innerHTML = '<p class="empty-history">No recent research found.</p>';
            return;
        }

        historyGrid.innerHTML = '';
        scriptHistory.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-card';
            card.innerHTML = `
                <h4>${item.topic}</h4>
                <div class="history-meta">
                    <span>${item.date}</span>
                    <span>${item.options.duration}</span>
                </div>
            `;
            card.addEventListener('click', () => {
                inputSection.classList.add('hidden');
                displayOutput(item.topic, item.options.duration, item.html);
            });
            historyGrid.appendChild(card);
        });
    }
});
