import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Visualizer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load the external stylesheets and scripts
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "/style.css";
    document.head.appendChild(styleLink);

    // Load Cytoscape and dependencies
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadAllScripts = async () => {
      try {
        await loadScript("https://unpkg.com/cytoscape@3.23.0/dist/cytoscape.min.js");
        await loadScript("https://unpkg.com/dagre@0.8.5/dist/dagre.min.js");
        await loadScript("https://unpkg.com/cytoscape-dagre@2.5.0/cytoscape-dagre.js");
        await loadScript("https://unpkg.com/dayjs@1.10.7/dayjs.min.js");
        await loadScript("/script.js");
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    };

    loadAllScripts();

    return () => {
      // Cleanup
      if (styleLink.parentNode) {
        styleLink.parentNode.removeChild(styleLink);
      }
    };
  }, []);

  return (
    <>
      {/* Navigation overlay */}
      <div style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 9999 }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/')}
          className="shadow-lg"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>

      {/* Original HTML content */}
      <div id="visualizer-app">
        <header>
          <div className="header-content">
            <div className="header-text">
              <h1>Task Dependency Visualizer</h1>
              <p>Visualize task dependencies and identify critical paths</p>
            </div>
            <div className="header-controls">
              <button id="dark-mode-toggle" className="btn btn-secondary"> Dark</button>
              <button id="export-btn" className="btn btn-secondary"> Export</button>
              <button id="import-btn" className="btn btn-secondary"> Import</button>
              <input type="file" id="import-file" accept=".json" style={{ display: 'none' }} />
              <button id="clear-tasks-btn" className="btn btn-danger"> Clear All</button>
            </div>
          </div>
        </header>
        <main>
          <div className="container">
            <section className="task-input-section">
              <div className="section-header">
                <h2>Add New Task</h2>
                <div className="demo-templates">
                  <button type="button" id="load-website-template" className="btn btn-small"> Website</button>
                  <button type="button" id="load-event-template" className="btn btn-small"> Event</button>
                  <button type="button" id="load-hospital-template" className="btn btn-small"> Hospital</button>
                </div>
              </div>
              <form id="task-form">
                <div className="form-group">
                  <label htmlFor="task-name">Task Name*</label>
                  <input type="text" id="task-name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="task-deadline">Deadline*</label>
                  <input type="date" id="task-deadline" required />
                </div>
                <div className="form-group">
                  <label htmlFor="task-duration">Duration (days)</label>
                  <input type="number" id="task-duration" min="1" placeholder="1" />
                </div>
                <div className="form-group">
                  <label htmlFor="task-dependencies">Dependencies</label>
                  <select id="task-dependencies" multiple>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="task-priority">Priority</label>
                  <select id="task-priority">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="task-status">Status</label>
                  <select id="task-status">
                    <option value="not-started" selected>Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </form>
            </section>
            <section className="task-list-section">
              <div className="section-header">
                <h2>Task List</h2>
                <div className="search-container">
                  <input type="text" id="search-tasks" placeholder="Search tasks..." />
                </div>
              </div>
              <div className="task-list" id="task-list">
              </div>
            </section>
          </div>
          <section className="visualization-section">
            <div className="tabs">
              <button className="tab-btn active" data-tab="dependency-graph">Dependency Graph</button>
              <button className="tab-btn" data-tab="timeline-view">Timeline View</button>
            </div>
            <div className="tab-content active" id="dependency-graph">
              <div id="cy" className="graph-container"></div>
              <div className="legend">
                <div className="legend-item">
                  <span className="legend-color normal"></span>
                  <span>Normal Task</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color critical"></span>
                  <span>Critical Path</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color overdue"></span>
                  <span>Overdue Task</span>
                </div>
              </div>
            </div>
            <div className="tab-content" id="timeline-view">
              <div className="timeline-controls">
                <button id="zoom-days" className="btn btn-small active">Days</button>
                <button id="zoom-weeks" className="btn btn-small">Weeks</button>
                <button id="zoom-months" className="btn btn-small">Months</button>
                <button id="export-graph" className="btn btn-small">Export Graph</button>
              </div>
              <div id="timeline-container" className="timeline-container"></div>
            </div>
          </section>
        </main>
        <div id="modal" className="modal">
          <div className="modal-content">
            <span className="close-btn">&times;</span>
            <h2>Edit Task</h2>
            <form id="edit-task-form">
              <input type="hidden" id="edit-task-id" />
              <div className="form-group">
                <label htmlFor="edit-task-name">Task Name*</label>
                <input type="text" id="edit-task-name" required />
              </div>
              <div className="form-group">
                <label htmlFor="edit-task-deadline">Deadline*</label>
                <input type="date" id="edit-task-deadline" required />
              </div>
              <div className="form-group">
                <label htmlFor="edit-task-duration">Duration (days)</label>
                <input type="number" id="edit-task-duration" min="1" placeholder="1" />
                <small>Optional. Defaults to 1 day if left blank.</small>
              </div>
              <div className="form-group">
                <label htmlFor="edit-task-dependencies">Dependencies</label>
                <select id="edit-task-dependencies" multiple>
                </select>
                <small>Hold Ctrl/Cmd to select multiple tasks</small>
              </div>
              <div className="form-group">
                <label htmlFor="edit-task-priority">Priority</label>
                <select id="edit-task-priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="edit-task-status">Status</label>
                <select id="edit-task-status">
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Update Task</button>
            </form>
          </div>
        </div>
        <footer>
          <p>&copy; 2025 Task Dependency Visualizer</p>
        </footer>
      </div>
    </>
  );
};

export default Visualizer;
