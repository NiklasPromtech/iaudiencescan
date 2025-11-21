import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  subtasks: Subtask[];
  note?: string;
}

interface Subtask {
  id: string;
  text: string;
  details?: string;
}

const StrategyPlaybook = () => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Load completed tasks from cookie on mount
  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("audiencescan_playbook="));
    
    if (cookie) {
      const value = cookie.split("=")[1];
      try {
        const tasks = JSON.parse(decodeURIComponent(value));
        setCompletedTasks(new Set(tasks));
      } catch (e) {
        console.error("Failed to parse playbook cookie");
      }
    }
  }, []);

  // Save to cookie whenever completedTasks changes
  useEffect(() => {
    const tasks = Array.from(completedTasks);
    document.cookie = `audiencescan_playbook=${encodeURIComponent(JSON.stringify(tasks))}; path=/; max-age=31536000`; // 1 year
  }, [completedTasks]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const tasks: Task[] = [
    {
      id: "task-1",
      title: "1. Create the scan",
      description: "Start by creating your audience scan on AudienceScan.",
      subtasks: [
        { id: "1-1", text: "Log into AudienceScan" },
        { id: "1-2", text: "Create a new scan with your target parameters" },
        { id: "1-3", text: "Wait for scan results to complete" },
        { id: "1-4", text: "Download or export the scan data" }
      ]
    },
    {
      id: "task-2",
      title: "2. Set up X (Twitter)",
      description: "Build brand awareness through targeted X advertising.",
      note: "Focus: Brand awareness. We want people to register that we exist above everything else.",
      subtasks: [
        { id: "2-1", text: "Go to ads.x.com" },
        { id: "2-2", text: "Copy the communities from your scan results" },
        { id: "2-3", text: "Create a new campaign" },
        { id: "2-4", text: "Create a new ad group" },
        { id: "2-5", text: "Paste the communities into the setup" },
        { id: "2-6", text: "Select your most recent organic tweets" },
        { id: "2-7", text: "Optimize towards the targeted communities with Profile Views and Followers", 
          details: "This means we're finding users who are interested. Our organic posts will look highly engaged (high views = more comments). We're building an audience who will see future posts for free (they will naturally show up in their feed)." }
      ]
    },
    {
      id: "task-3",
      title: "3. Set up a Telegram campaign",
      description: "Reach targeted communities on Telegram with precision.",
      subtasks: [
        { id: "3-1", text: "Go to ads.telegram.org" },
        { id: "3-2", text: "Copy the channels from the scan" },
        { id: "3-3", text: "Paste them into a notepad for reference" },
        { id: "3-4", text: "Create a new ad campaign" },
        { id: "3-5", text: "Paste the channels (one by one - Telegram limitation)" },
        { id: "3-6", text: "Create the ad creative" },
        { id: "3-7", text: "Press Create ad to launch",
          details: "We recommend sending users to a Telegram bot (we can help build this). Sending people directly to a channel you don't fully control is risky. With a bot you can guide them properly and ask qualifying questions: Are they interested in generating stable returns? Are they trading a token and want deeper insights? Would they benefit from an AI agent for trade research?" }
      ]
    },
    {
      id: "task-4",
      title: "4. Set up a Reddit campaign",
      description: "Leverage Reddit communities for deeper engagement.",
      note: "This doesn't apply to every scan, but we usually use it frequently.",
      subtasks: [
        { id: "4-1", text: "Go to ads.reddit.com" },
        { id: "4-2", text: "Copy the communities from your scan" },
        { id: "4-3", text: "Create a new campaign" },
        { id: "4-4", text: "Create a new ad group" },
        { id: "4-5", text: "Paste the communities" },
        { id: "4-6", text: "Select your most recent organic posts" },
        { id: "4-7", text: "Optimize for clicks" }
      ]
    },
    {
      id: "task-5",
      title: "5. Set up a Google or DV360 campaign",
      description: "Tap into Google's advertising ecosystem with token-specific keywords.",
      note: "Token-tag keywords outperform Google's flagship 'Intent targeting' 9/10 times.",
      subtasks: [
        { id: "5-1", text: "If you don't have a DV360 seat, reach out to support for approval" },
        { id: "5-2", text: "Go to ads.google.com or displayvideo.google.com" },
        { id: "5-3", text: "Copy the tags from the scan" },
        { id: "5-4", text: "Create a new campaign" },
        { id: "5-5", text: "Paste the tags in as keywords" },
        { id: "5-6", text: "Add wallet detection JavaScript to your site",
          details: "Since CPMs are much lower here, track conversions for users with a wallet extension installed. Add this JavaScript snippet to your site:\n\n<script type=\"text/javascript\">\n  (function() {\n      if (typeof window.ethereum !== 'undefined') {\n            [Add your conversion tracker here]\n      }\n  })();\n</script>" },
        { id: "5-7", text: "Set the campaign to desktop only",
          details: "We're optimizing for users who are already in Web3 and ready to take action." }
      ]
    },
    {
      id: "task-6",
      title: "6. X DM campaign",
      description: "Direct outreach to relevant X users with personalized messaging.",
      subtasks: [
        { id: "6-1", text: "Go to Drippy.ai" },
        { id: "6-2", text: "Start your free trial (if you don't have an account)" },
        { id: "6-3", text: "Create a new lead source" },
        { id: "6-4", text: "Select 'Scraper'" },
        { id: "6-5", text: "Select 'account source'" },
        { id: "6-6", text: "Paste one X account from the scan (repeat for ~5 most relevant communities)" },
        { id: "6-7", text: "Use an account OTHER than your main project account",
          details: "For messaging, simply nudge the user in the right direction. Ask questions (like the Telegram bot idea). The goal is to show that you're someone researching new projects, you've been looking over their project, and you're exploring more opportunities." }
      ]
    },
    {
      id: "task-7",
      title: "7. Telegram DM campaign",
      description: "Automated Telegram outreach with AI-powered messaging.",
      subtasks: [
        { id: "7-1", text: "Go to Enreach.ai" },
        { id: "7-2", text: "Speak to the Enreach team to get your account set up" },
        { id: "7-3", text: "Follow similar setup steps as X DMs" },
        { id: "7-4", text: "Configure the AI agent bot",
          details: "Enreach has excellent AI agents that can act as your bot, so setup is actually easier than manual messaging." }
      ]
    },
    {
      id: "task-8",
      title: "8. X KOL Outreach",
      description: "Connect with key opinion leaders who have established audiences.",
      subtasks: [
        { id: "8-1", text: "Follow same steps as X DM campaign (Task 6)" },
        { id: "8-2", text: "Filter the lead list for users with 10,000+ followers" },
        { id: "8-3", text: "Use your MAIN project account here (not secondary account)" },
        { id: "8-4", text: "Craft messaging focused on exploring a promotion opportunity",
          details: "The messaging should focus on wanting to explore a promotion and connect professionally." }
      ]
    },
    {
      id: "task-9",
      title: "9. Reddit Comment Campaign",
      description: "Introduce 'Sandwich Marketing' through strategic Reddit comments.",
      note: "This is NOT a posting campaign. It's purely comments on relevant communities.",
      subtasks: [
        { id: "9-1", text: "Go to redditpulse.app" },
        { id: "9-2", text: "Take the communities from the scan" },
        { id: "9-3", text: "Create a new campaign" },
        { id: "9-4", text: "Use the AI to fill in the setup" },
        { id: "9-5", text: "Remove the pre-set communities" },
        { id: "9-6", text: "Paste in the communities from the scan" },
        { id: "9-7", text: "Launch the campaign",
          details: "Around 120 different writers will receive comment tasks and write 'sandwich comments': They mention 2 well-known projects, BUT in the middle (the 'filling') they mention your project. The reader thinks: 'I know those two… but what's this one in the middle?' It works for lower-funnel engagement on complex projects. The real bonus: AI systems scrape Reddit for recommendations. When they see repeated mentions in these patterns, they start recommending your project. It needs volume, but the upside is massive." }
      ]
    },
    {
      id: "task-10",
      title: "10. [ADVANCED] Micro-Universe Campaign",
      description: "Create an ecosystem article and saturate small, targeted communities.",
      note: "This advanced strategy embeds your brand in the memory of ideal micro-communities.",
      subtasks: [
        { id: "10-1", text: "Create an article about your project and other players in the space" },
        { id: "10-2", text: "Filter communities you want to target on X" },
        { id: "10-3", text: "Pick around 5 geos (geographical locations)" },
        { id: "10-4", text: "Look for communities around 10,000 members",
          details: "This size is ideal — big enough to matter, small enough to saturate." },
        { id: "10-5", text: "Run ads targeting these communities with message: 'Read our latest article about [topic]'" },
        { id: "10-6", text: "Add a simple CPA (e.g., 'check out the page to whitelist')",
          details: "The goal is to embed your brand in the memory of these users. When they read the article later, they're already primed to feel more familiar with your project." }
      ]
    }
  ];

  const totalSubtasks = tasks.reduce((acc, task) => acc + task.subtasks.length, 0);
  const completedSubtasks = Array.from(completedTasks).filter(id => id.includes("-")).length;
  const progressPercentage = (completedSubtasks / totalSubtasks) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Strategy Playbook
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              "But how do I use this data?" Here's exactly how we build out a 10-step strategy to turn your AudienceScan data into real marketing results.
            </p>
            
            {/* Progress Indicator */}
            <Card className="p-6 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedSubtasks} of {totalSubtasks} tasks completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </Card>
          </div>

          {/* Tasks Accordion */}
          <Accordion type="multiple" className="space-y-4">
            {tasks.map((task, index) => {
              const taskSubtasksCompleted = task.subtasks.filter(st => completedTasks.has(st.id)).length;
              const taskProgress = (taskSubtasksCompleted / task.subtasks.length) * 100;
              const isTaskComplete = taskProgress === 100;

              return (
                <AccordionItem 
                  key={task.id} 
                  value={task.id}
                  className="border border-border rounded-lg overflow-hidden bg-card"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-4 flex-1 text-left">
                      <div className="flex-shrink-0">
                        {isTaskComplete ? (
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        )}
                        <div className="mt-2">
                          <Progress value={taskProgress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {taskSubtasksCompleted}/{task.subtasks.length} steps
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 pb-6 pt-2">
                    {task.note && (
                      <div className="mb-4 p-3 bg-accent/30 rounded-md border border-primary/20">
                        <p className="text-sm text-foreground font-medium">{task.note}</p>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {task.subtasks.map((subtask, subIndex) => (
                        <div key={subtask.id} className="space-y-2">
                          <div className="flex items-start gap-3 group">
                            <Checkbox
                              id={subtask.id}
                              checked={completedTasks.has(subtask.id)}
                              onCheckedChange={() => toggleTask(subtask.id)}
                              className="mt-1"
                            />
                            <label
                              htmlFor={subtask.id}
                              className="flex-1 text-sm leading-relaxed cursor-pointer group-hover:text-primary transition-colors"
                            >
                              <span className="font-medium">
                                {String.fromCharCode(97 + subIndex)})
                              </span>{" "}
                              {subtask.text}
                            </label>
                          </div>
                          {subtask.details && (
                            <div className="ml-8 pl-4 border-l-2 border-muted">
                              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                {subtask.details}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Final Note */}
          <Card className="mt-12 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <h3 className="text-xl font-semibold mb-3">Final Note</h3>
            <p className="text-muted-foreground leading-relaxed">
              This might feel like a roundabout way of doing things. But put yourself in the position of a potential customer: They don't care about your project yet. They don't know the hard work you've done. But if we can make them feel like they care before they even reach your page, they're far more likely to take action.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4 font-medium">
              It's classic sales: <span className="text-primary">warm up the lead first.</span>
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Visitors should be able to mark tasks as done, and your progress is automatically saved as you work through the playbook.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StrategyPlaybook;