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

    // Modal Elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveKeyBtn = document.getElementById('saveKeyBtn');

    let currentScriptText = "";
    let scriptHistory = JSON.parse(localStorage.getItem('yt_script_history') || '[]');
    let geminiApiKey = localStorage.getItem('gemini_api_key') || '';

    // Initialize UI
    renderHistory();
    if(geminiApiKey) {
        apiKeyInput.value = geminiApiKey;
    } else {
        settingsBtn.classList.add('attention');
    }

    // Modal Logic
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
        settingsBtn.classList.remove('attention');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
        if(!geminiApiKey) settingsBtn.classList.add('attention');
    });

    settingsModal.addEventListener('click', (e) => {
        if(e.target === settingsModal) {
            settingsModal.classList.add('hidden');
            if(!geminiApiKey) settingsBtn.classList.add('attention');
        }
    });

    saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if(key) {
            localStorage.setItem('gemini_api_key', key);
            geminiApiKey = key;
            settingsBtn.classList.remove('attention');
            saveKeyBtn.textContent = "Saved!";
            saveKeyBtn.classList.add('btn-success');
            setTimeout(() => {
                settingsModal.classList.add('hidden');
                saveKeyBtn.textContent = "Save API Key";
                saveKeyBtn.classList.remove('btn-success');
            }, 1000);
        }
    });

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
        "Evaluating source authenticity and confidence...",
        "Finalizing formatting..."
    ];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!geminiApiKey) {
            settingsModal.classList.remove('hidden');
            settingsBtn.classList.remove('attention');
            return;
        }

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
        
        // Start Progress Animation
        const progressInterval = startProgressAnimation();

        try {
            // Generate Prompt
            const prompt = constructGeminiPrompt(options);
            
            // Call Gemini API
            logProgress("Connecting to Google Gemini API...");
            const generatedMarkdown = await callGeminiAPI(prompt, geminiApiKey);
            
            // Convert Markdown to our HTML structure
            logProgress("Parsing AI output and formatting script...");
            const generatedHtml = parseScriptToHtml(generatedMarkdown, options);

            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressSubtitle.textContent = "Research Complete. Script generated.";

            // Save to History
            saveToHistory({
                id: Date.now(),
                topic: options.topic,
                date: new Date().toLocaleDateString(),
                html: generatedHtml,
                options: options
            });

            setTimeout(() => {
                displayOutput(options.topic, options.duration, generatedHtml);
            }, 500);

        } catch (error) {
            clearInterval(progressInterval);
            progressSubtitle.textContent = "Analysis Failed.";
            const errorMsg = `<span style="color: #ef4444;">Error: ${error.message}</span>`;
            logProgressHTML(errorMsg);
            progressSubtitle.innerHTML = errorMsg;
            setTimeout(() => {
                progressSection.classList.add('hidden');
                inputSection.classList.remove('hidden');
                if(error.message.includes('API key')) {
                    settingsModal.classList.remove('hidden');
                }
            }, 3000);
        }
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

    function startProgressAnimation() {
        let currentStep = 0;
        return setInterval(() => {
            if(currentStep >= researchSteps.length - 1) return; // leave last step for actual completion
            logProgress(researchSteps[currentStep]);
            progressBar.style.width = `${(currentStep / researchSteps.length) * 100}%`;
            currentStep++;
        }, 1200);
    }

    function logProgress(msg) {
        const li = document.createElement('li');
        li.textContent = `> [${new Date().toLocaleTimeString()}] ${msg}`;
        progressLog.appendChild(li);
        progressLog.scrollTop = progressLog.scrollHeight;
        progressSubtitle.textContent = msg;
    }

    function logProgressHTML(htmlMsg) {
        const li = document.createElement('li');
        li.innerHTML = `> [${new Date().toLocaleTimeString()}] ${htmlMsg}`;
        progressLog.appendChild(li);
        progressLog.scrollTop = progressLog.scrollHeight;
    }

    function getDurationLabel(dur) {
        if(dur === 'short') return "3-5 Minutes (approx 600-800 words)";
        if(dur === 'medium') return "8-12 Minutes (approx 1500-1800 words)";
        return "15-20 Minutes (approx 2500+ words)";
    }

    // --- AI PROMPT ENGINEERING ---
    function constructGeminiPrompt(opt) {
        let wordCount = "600-800 words";
        if(opt.duration === 'medium') wordCount = "1500-1800 words";
        if(opt.duration === 'long') wordCount = "2500+ words";

        const hasFace = opt.contentType !== 'faceless';
        const speaker = hasFace ? "HOST (On Camera) / HOST (V.O)" : "NARRATOR (V.O)";

        let prompt = `You are a world-class, premium YouTube scriptwriter. Your task is to write a highly engaging, deeply researched, and beautifully structured video script.
        
TOPIC: ${opt.topic}
NICHE (Subject Area): ${opt.niche}
CONTENT STYLE (Format): ${opt.contentStyle}
VOICE TONE: ${opt.tone}
TARGET DURATION: ${opt.duration} (${wordCount})
PRODUCTION STYLE: ${opt.contentType}

INSTRUCTIONS:
1. Write a complete script meeting the target word count.
2. Structure the script using clear markdown headings (e.g., ## Chapter 1: Title).
3. The speaking roles MUST be denoted as **${speaker}:**.
4. Include visual and audio cues. Format them EXACTLY like this: [VISUAL: description] or [AUDIO: description].
5. Do NOT include ANY HTML tags in your response. Only use Markdown.
`;

        if(opt.includeHook) {
            prompt += `6. Start with a powerful, attention-grabbing Hook chapter.\n`;
        } else {
            prompt += `6. Skip the intro/hook and dive straight into the main content.\n`;
        }

        if(opt.includeSEO) {
            prompt += `7. Before the script begins, provide a "## SEO Metadata" section with a Primary Keyword, 3 Secondary Keywords, and an optimized Clickable Title.\n`;
        }

        if(opt.animations === 'detailed') {
            prompt += `8. For [VISUAL] cues, write highly detailed, descriptive prompts suitable for generating B-roll with an AI video/image generator.\n`;
        } else {
            prompt += `8. For [VISUAL] cues, use standard video editing instructions.\n`;
        }

        prompt += `\nCRITICAL FINAL STEP:
At the very end of your response, after the script conclusion, you MUST append a section titled "## Research Transparency".
In this section, provide:
1. **Sources**: A bulleted list of 2-4 plausible, credible sources or academic domains that would verify the facts in this script.
2. **Confidence Score**: A percentage (e.g., 95%) representing your confidence in the authenticity and accuracy of the content, followed by one short sentence justifying the score.`;

        return prompt;
    }

    async function callGeminiAPI(prompt, apiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to fetch from Gemini API");
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Unexpected API response structure.");
        }
    }

    function parseScriptToHtml(markdown, opt) {
        // Basic Markdown to HTML conversion
        let html = markdown;

        // Escape HTML to prevent XSS (basic)
        html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold text and Speakers
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

        // Format Visual and Audio cues
        html = html.replace(/\[VISUAL:(.*?)\]/gim, '<div class="visual-cue"><i class="fa-solid fa-video"></i> <span>$1</span></div>');
        html = html.replace(/\[AUDIO:(.*?)\]/gim, '<div class="audio-cue"><i class="fa-solid fa-music"></i> <span>$1</span></div>');
        
        // Handle alternative cue formats the AI might use
        html = html.replace(/\[VISUAL CUE:(.*?)\]/gim, '<div class="visual-cue"><i class="fa-solid fa-video"></i> <span>$1</span></div>');
        html = html.replace(/\[AUDIO CUE:(.*?)\]/gim, '<div class="audio-cue"><i class="fa-solid fa-music"></i> <span>$1</span></div>');

        // Handle Research Transparency block specifically
        html = html.replace(/<h2>Research Transparency<\/h2>([\s\S]*?)(?=(<h2>|$))/gi, (match, content) => {
            let processedContent = content.trim().split('\n').map(line => {
                if(line.startsWith('- ') || line.startsWith('* ')) {
                    return `<li>${line.substring(2)}</li>`;
                }
                if(line.match(/^\d+\.\s/)) {
                     // If it's a numbered list item inside transparency
                     return `<p>${line}</p>`;
                }
                return `<p>${line}</p>`;
            }).join('');
            
            // Clean up list items by wrapping consecutive <li> in <ul>
            processedContent = processedContent.replace(/(<li>.*?<\/li>)+/g, match => `<ul>${match}</ul>`);

            return `<div class="transparency-block">
                <h3><i class="fa-solid fa-shield-halved"></i> Research Transparency</h3>
                ${processedContent}
            </div>`;
        });

        // Paragraphs (split by double newline, avoiding already formatted blocks)
        const paragraphs = html.split(/\n\n+/);
        html = paragraphs.map(p => {
            p = p.trim();
            if (p.startsWith('<h') || p.startsWith('<div class="visual-cue"') || p.startsWith('<div class="audio-cue"') || p.startsWith('<div class="transparency-block"')) {
                return p;
            } else if (p && !p.startsWith('<li>') && !p.startsWith('<ul>')) {
                return `<p>${p}</p>`;
            }
            return p; // Keep lists intact
        }).join('\n');

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
