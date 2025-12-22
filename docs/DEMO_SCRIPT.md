# JacPilot Demo Script - Conversational Walkthrough

**Duration**: ~5-7 minutes  
**Style**: Conversational, natural, human-like  
**Target**: Hackathon judges and technical evaluators

---

## 🎬 Opening (30 seconds)

**[Screen: JacPilot homepage]**

"Hey! So I'm super excited to show you JacPilot - it's this interactive learning platform we built for teaching Jaseci and Jac programming. Think of it like Duolingo, but specifically for graph-based AI programming.

The cool thing is, it's not just static documentation - it actually adapts to how you're learning. It uses AI to generate quizzes, evaluates your answers, and figures out what you should study next. Pretty neat, right?

Let me walk you through how it works..."

---

## 📚 Feature 1: Lessons & Learning Path (1 minute)

**[Navigate to Dashboard → Lessons]**

"So first, let's look at the lessons. We've got a whole curriculum here covering everything from basic Jaseci concepts to advanced topics like walkers, OSP graphs, and byLLM integration.

**[Click on a lesson]**

"Each lesson has interactive content - you can read through the concepts, see code examples, and practice as you go. Notice how it's all structured? That's because behind the scenes, we're using an OSP graph to model the learning relationships.

**[Scroll through lesson]**

"The lessons are connected through prerequisites - you can't jump to advanced topics until you've mastered the basics. The system tracks your progress and unlocks new content as you learn."

---

## 🤖 Feature 2: AI-Powered Quiz Generation (1.5 minutes)

**[Navigate to Quiz page]**

"Okay, so here's where it gets really cool. Let's take a quiz for this lesson on Jaseci concepts.

**[Click 'Take Quiz']**

"Watch this - when I click 'Take Quiz', the frontend calls our Jaseci backend using **Jac Client**. Specifically, it uses `jacSpawn()` to call the `quiz_generator` walker.

**[Show browser DevTools Network tab if possible, or explain]**

"Now, the `quiz_generator` walker doesn't just pull questions from a database - it actually uses **byLLM** with Gemini AI to generate quiz questions on the fly based on the lesson content. This is the generative AI use case - creating content dynamically.

**[Quiz loads, show questions]**

"See? These questions are AI-generated, tailored to this specific lesson. And notice the difficulty? The system adapts it based on how many concepts are in the lesson. More concepts means a harder quiz.

**[Answer a few questions]**

"Let me answer these... I'll get some right, some wrong, just to show you how the evaluation works..."

---

## 🎯 Feature 3: AI Answer Evaluation & Adaptive Feedback (2 minutes)

**[Submit quiz]**

"Alright, let's submit this quiz. When I click submit, again we're using **Jac Client** - this time calling the `answer_evaluator` walker.

**[Results page loads]**

"Whoa, look at this! The system evaluated my answers using **byLLM** - this is the analytical AI use case. It didn't just check if I got them right or wrong, it actually analyzed my answers and gave me personalized feedback.

**[Point to AI Feedback section]**

"See this feedback? The AI looked at which questions I got wrong, analyzed my performance, and gave me specific advice on what concepts I should review. That's byLLM doing analytical work - understanding my mistakes and providing actionable guidance.

**[Point to question breakdown]**

"And here's a breakdown of each question - green checkmarks for what I got right, red X's for what I got wrong, and it shows me the correct answers.

**[Point to revision prompt if score < 70%]**

"Oh, and since I scored below 70%, the system detected that I need revision and is prompting me to review those weak concepts. That's the adaptive learning logic kicking in - it's not just telling me my score, it's actively guiding my learning."

---

## 🗺️ Feature 4: Skill Map & Progress Tracking (1 minute)

**[Navigate to Skill Map]**

"Let's check out the skill map. This is a visual representation of my learning progress.

**[Show skill map visualization]**

"Each node here represents a concept - things like 'Walkers', 'OSP', 'byLLM', etc. The colors show my mastery level - green means I've mastered it, yellow means I'm working on it, gray means I haven't started.

**[Point to edges]**

"These edges show the relationships - prerequisites and recommendations. The system uses the OSP graph to understand how concepts connect, which helps it recommend what I should learn next.

**[Show stats]**

"And here are my stats - total concepts, mastered, in progress, not started. All of this is tracked through our OSP graph structure."

---

## 🔧 Feature 5: Jaseci Components Deep Dive (1.5 minutes)

**[Switch to code view or architecture diagram]**

"Let me show you the technical side. This whole thing is built on the Jaseci stack, and we're using all the mandatory components.

**[Show jacClient.ts or explain]**

"First, **Jac Client** - every single API call from the frontend goes through `jacSpawn()`. We never make direct HTTP calls. Everything goes through walkers. Quiz generation? `jacSpawn('quiz_generator')`. Answer evaluation? `jacSpawn('answer_evaluator')`. Progress tracking? `jacSpawn('progress_tracker')`. You get the idea.

**[Show main.jac]**

"Second, **byLLM** - we're using it in two ways. Generative: the `quiz_generator` walker uses `generate_quiz_content()` which calls byLLM to create quiz questions. Analytical: the `answer_evaluator` uses `evaluate_answer_content()` to analyze answers and provide feedback.

**[Show OSP graph nodes]**

"And third, the **OSP Graph** - we've got nodes for users, concepts, lessons, mastery, and quizzes. The graph tracks relationships, prerequisites, and learning paths. When the learning planner figures out what lesson to recommend next, it's traversing this graph.

**[Show walker examples]**

"We've got five main walkers - learning_planner, quiz_generator, answer_evaluator, progress_tracker, and skill_analyzer. Each one has a specific job, and they all work together to create this adaptive learning experience."

---

## 🎯 Feature 6: End-to-End Workflow (1 minute)

**[Navigate back to Dashboard]**

"Let me show you the complete workflow from start to finish.

**[Point to Learning Path]**

"See this learning path? The `learning_planner` walker analyzed my progress, checked my mastery scores in the OSP graph, and recommended this next lesson. It's using byLLM to personalize the recommendation message.

**[Click on recommended lesson]**

"I'll click on this recommended lesson...

**[Go through lesson quickly]**

"...work through it...

**[Take quiz]**

"...take the AI-generated quiz...

**[Show results]**

"...get AI-evaluated feedback with revision prompts if needed...

**[Back to dashboard]**

"...and the system updates my progress, adjusts my skill map, and recommends the next lesson. It's a complete adaptive learning loop.

"The whole thing is powered by Jaseci - Jac Client for communication, byLLM for AI intelligence, and OSP graphs for modeling the learning relationships. It's not just a static platform, it's a personalized tutor that adapts to how you learn."

---

## 🎬 Closing (30 seconds)

**[Back to homepage]**

"So that's JacPilot! We've got:
- ✅ Interactive lessons with adaptive learning paths
- ✅ AI-powered quiz generation using byLLM
- ✅ Intelligent answer evaluation with personalized feedback
- ✅ Visual skill maps showing mastery progress
- ✅ Full Jaseci stack integration - Jac Client, byLLM, and OSP graphs

Everything's working end-to-end, and it's all built on the mandatory Jaseci components. The platform actually learns how you learn and adapts accordingly.

Thanks for watching! Feel free to check out the code - everything's on GitHub, and we've got comprehensive documentation in the docs folder. Any questions?"

---

## 📝 Demo Tips

**Tone**: 
- Conversational and enthusiastic
- Explain like you're showing a friend
- Use "we" and "I" naturally
- Don't be overly formal

**Pacing**:
- Don't rush, but keep it moving
- Pause briefly after showing key features
- Let the UI speak for itself when possible

**Technical Details**:
- Mention Jac Client, byLLM, and OSP when relevant
- Show code/architecture when it adds value
- Don't get too deep in the weeds - focus on what it does, not every line of code

**What to Emphasize**:
- ✅ All mandatory Jaseci components are used
- ✅ AI is actually working (not just placeholders)
- ✅ Adaptive learning is functional
- ✅ End-to-end workflow is complete

**Potential Issues to Address**:
- If quiz generation is slow: "The AI is generating questions in real-time, so it takes a moment..."
- If API errors: "The backend needs to be running, but you can see the frontend is calling the right endpoints..."
- If data is missing: "In production, this would be populated from the OSP graph, but you can see the structure..."

---

## 🎥 Recording Checklist

- [ ] Homepage loads correctly
- [ ] Can navigate to lessons
- [ ] Can view a lesson
- [ ] Can generate a quiz (Jac Client working)
- [ ] Quiz questions appear (byLLM working)
- [ ] Can submit quiz
- [ ] Results show AI feedback (byLLM analytical)
- [ ] Revision prompt appears if score < 70%
- [ ] Skill map displays correctly
- [ ] Dashboard shows progress
- [ ] Learning path recommends next lesson
- [ ] All features work end-to-end

**Backup Plan**: If something breaks during recording, acknowledge it naturally: "Oh, looks like the backend needs a restart, but you can see from the code that this is how it's supposed to work..."

