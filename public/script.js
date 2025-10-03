// Register Cytoscape-Dagre plugin if available (needed for 'dagre' layout)
if (typeof window !== 'undefined' && window.cytoscape && window.cytoscapeDagre) {
  window.cytoscape.use(window.cytoscapeDagre);
}

// Main data structure to store tasks
let tasks = [];

// DOM elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const dependencySelect = document.getElementById('task-dependencies');
const editDependencySelect = document.getElementById('edit-task-dependencies');
const searchInput = document.getElementById('search-tasks');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');
const editTaskForm = document.getElementById('edit-task-form');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// New DOM elements
const darkModeToggle = document.getElementById('dark-mode-toggle');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');
const loadWebsiteTemplate = document.getElementById('load-website-template');
const loadEventTemplate = document.getElementById('load-event-template');
const loadHospitalTemplate = document.getElementById('load-hospital-template');
const zoomDays = document.getElementById('zoom-days');
const zoomWeeks = document.getElementById('zoom-weeks');
const zoomMonths = document.getElementById('zoom-months');
const exportGraph = document.getElementById('export-graph');

// Inline SVG icon set (Lucide-like)
const Icons = {
  pencil: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',
  trash: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
  sun: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  moon: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  plus: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  download: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  broom: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M20 3L9 14"/><path d="M9 14l-3 7-3-3 7-4z"/></svg>',
  globe: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 010 20a15.3 15.3 0 010-20z"/></svg>',
  calendar: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  calendarRange: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><rect x="7" y="14" width="4" height="4"/><rect x="13" y="14" width="4" height="4"/></svg>',
  hospital: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"/><path d="M12 8v8"/><path d="M8 12h8"/><path d="M3 21h18"/></svg>'
};

function setDarkToggleLabel(isDark) {
  if (!darkModeToggle) return;
  darkModeToggle.innerHTML = isDark ? `${Icons.sun} Light` : `${Icons.moon} Dark`;
}

// Cytoscape instance for graph visualization
let cy;

// Initialize the application
(function() {
  function bootstrap() {
    // Guard against multiple initializations (e.g., re-entering the route)
    if (typeof window !== 'undefined') {
      if (window.__TDV_BOOTSTRAPPED) return;
      window.__TDV_BOOTSTRAPPED = true;
    }

    initializeCytoscape();
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === '1') {
      localStorage.removeItem('taskDependencyVisualizer');
    }
    loadTasksFromLocalStorage();
    // Optionally load demo data only when explicitly requested via ?demo=1
    const shouldLoadDemo = tasks.length === 0 && params.get('demo') === '1';
    if (shouldLoadDemo) {
      loadDemoData();
    }
    renderTasks();
    updateDependencySelects();
    // Setup event listeners
    setupEventListeners();
  }

  // Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    // DOM is already ready, run bootstrap immediately
    bootstrap();
  }
})();

// Initialize Cytoscape for graph visualization
function initializeCytoscape() {
  cy = cytoscape({
    container: document.getElementById('cy'),
    style: [
      {
        selector: 'core',
        style: {
          // core background color controlled via CSS/theme toggle later
        }
      },
      {
        selector: 'node',
        style: {
          'background-color': '#4a6fa5',
          'label': 'data(label)',
          'color': '#fff',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '12px',
          'text-wrap': 'wrap',
          'text-max-width': '80px',
          'width': '100px',
          'height': '100px',
          'border-width': 2,
          'border-color': '#3a5a80'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#7d8597',
          'target-arrow-color': '#7d8597',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      },
      {
        selector: 'node.critical',
        style: {
          'background-color': '#47b8e0',
          'border-color': '#3a9fc0'
        }
      },
      {
        selector: 'edge.critical',
        style: {
          'line-color': '#47b8e0',
          'target-arrow-color': '#47b8e0',
          'width': 5
        }
      },
      {
        selector: '.overdue',
        style: {
          'background-color': '#ff6b6b',
          'border-color': '#e55c5c'
        }
      },
      {
        selector: 'node.search-highlight',
        style: {
          'background-color': '#ffc107', // yellow-ish
          'border-color': '#c79100',
          'border-width': 4,
          'font-weight': 'bold'
        }
      },
      {
        selector: 'edge.search-highlight',
        style: {
          'line-color': '#ffc107',
          'target-arrow-color': '#ffc107',
          'width': 4
        }
      }
    ],
    layout: {
      name: 'dagre',
      rankDir: 'LR',
      nodeSep: 100,
      rankSep: 150,
      padding: 50
    },
    userZoomingEnabled: true,
    userPanningEnabled: true
    // left wheelSensitivity at default (avoid custom settings that cause unnatural zoom)
  });

  // node click -> show tooltip with task details
  cy.on('tap', 'node', evt => {
    const node = evt.target;
    showNodeTooltip(node);
    // Also show ancestors (upstream) quickly if user wants (non-destructive)
    // We'll highlight ancestors for 2.5s
    const ancestors = node.predecessors('node');
    cy.elements().removeClass('temp-highlight');
    node.addClass('temp-highlight');
    ancestors.forEach(n => n.addClass('temp-highlight'));
    setTimeout(() => cy.elements().removeClass('temp-highlight'), 2500);
  });

  // remove tooltip on canvas click
  cy.on('tap', evt => {
    if (evt.target === cy) {
      removeNodeTooltip();
    }
  });

  // ensure cy.fit() after initial layout
  cy.ready(() => {
    try { cy.layout({ name: 'dagre', rankDir: 'LR' }).run(); cy.fit(); } catch (e) { /* ignore */ }
  });
}

// Setup all event listeners
function setupEventListeners() {
  // Form submission for creating new tasks
  taskForm.addEventListener('submit', handleTaskFormSubmit);
  // Search functionality
  searchInput.addEventListener('input', handleSearchInput);
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      switchTab(tabName);
    });
  });
  // Modal close button
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  // Close modal when clicking outside
  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  // Edit task form submission
  editTaskForm.addEventListener('submit', handleEditTaskFormSubmit);

  // Dark mode toggle
  darkModeToggle.addEventListener('click', toggleDarkMode);
  // Initialize button labels/icons based on current theme
  setDarkToggleLabel(document.body.getAttribute('data-theme') === 'dark');

  // Export/Import functionality
  exportBtn.innerHTML = `${Icons.download} Export`;
  importBtn.innerHTML = `${Icons.upload} Import`;
  exportBtn.addEventListener('click', exportData);
  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', handleFileImport);

  // Demo templates
  loadWebsiteTemplate.innerHTML = `${Icons.globe} Website`;
  loadEventTemplate.innerHTML = `${Icons.calendar} Event`;
  loadHospitalTemplate.innerHTML = `${Icons.hospital} Hospital`;
  loadWebsiteTemplate.addEventListener('click', () => loadTemplate('website'));
  loadEventTemplate.addEventListener('click', () => loadTemplate('event'));
  loadHospitalTemplate.addEventListener('click', () => loadTemplate('hospital'));

  // Timeline zoom controls
  zoomDays.innerHTML = `${Icons.sun} Days`;
  zoomWeeks.innerHTML = `${Icons.calendar} Weeks`;
  zoomMonths.innerHTML = `${Icons.calendarRange} Months`;
  zoomDays.addEventListener('click', () => setTimelineZoom('days'));
  zoomWeeks.addEventListener('click', () => setTimelineZoom('weeks'));
  zoomMonths.addEventListener('click', () => setTimelineZoom('months'));

  // Export graph
  exportGraph.innerHTML = `${Icons.download} Export Graph`;
  exportGraph.addEventListener('click', exportGraphAsImage);

  const clearBtn = document.getElementById('clear-tasks-btn');
  if (clearBtn) {
    clearBtn.innerHTML = `${Icons.broom} Clear All`;
    clearBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
        tasks = [];
        localStorage.removeItem('taskDependencyVisualizer');
        document.getElementById('task-list').innerHTML = '';
        if (cy) cy.elements().remove();
      }
    });
  }

  // Enhance submit button label
  const submitBtn = document.querySelector('#task-form button[type="submit"]');
  if (submitBtn) submitBtn.innerHTML = `${Icons.plus} Add Task`;
}

// Handle task form submission
function handleTaskFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('task-name').value.trim();
  const deadline = document.getElementById('task-deadline').value;
  const durationRaw = document.getElementById('task-duration') ? document.getElementById('task-duration').value : '';
  const duration = durationRaw ? Math.max(1, parseInt(durationRaw, 10) || 1) : 1;
  const selectedDependencies = Array.from(dependencySelect.selectedOptions).map(option => option.value);
  const priority = document.getElementById('task-priority').value;
  const status = document.getElementById('task-status').value;

  // Create new task object
  const newTask = {
    id: generateId(),
    name,
    deadline,
    duration,
    dependencies: selectedDependencies,
    priority,
    status,
    createdAt: new Date().toISOString()
  };

  // Check for circular dependencies before adding
  const tempTasks = [...tasks, newTask];
  if (hasCycle(createAdjacencyList(tempTasks))) {
    alert('Error: Circular dependency detected! Please fix dependencies.');
    return;
  }

  // Add task and update UI
  tasks.push(newTask);
  saveTasksToLocalStorage();
  renderTasks();
  updateDependencySelects();
  updateGraph();
  updateTimeline();
  // Reset form
  taskForm.reset();
}

// Handle edit task form submission
function handleEditTaskFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('edit-task-id').value;
  const name = document.getElementById('edit-task-name').value.trim();
  const deadline = document.getElementById('edit-task-deadline').value;
  const durationRaw = document.getElementById('edit-task-duration') ? document.getElementById('edit-task-duration').value : '';
  const duration = durationRaw ? Math.max(1, parseInt(durationRaw, 10) || 1) : 1;
  const selectedDependencies = Array.from(editDependencySelect.selectedOptions).map(option => option.value);
  const priority = document.getElementById('edit-task-priority').value;
  const status = document.getElementById('edit-task-status').value;

  // Update task
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    const updatedTask = {
      ...tasks[taskIndex],
      name,
      deadline,
      duration,
      dependencies: selectedDependencies,
      priority,
      status
    };
    // Create a temporary task array to check for cycles
    const tempTasks = [...tasks];
    tempTasks[taskIndex] = updatedTask;
    if (hasCycle(createAdjacencyList(tempTasks))) {
      alert('Error: Circular dependency detected! Please fix dependencies.');
      return;
    }
    // Update task and UI
    tasks[taskIndex] = updatedTask;
    saveTasksToLocalStorage();
    renderTasks();
    updateDependencySelects();
    updateGraph();
    updateTimeline();
    // Close modal
    modal.style.display = 'none';
  }
}

// Handle search input (list filtering + graph highlighting)
function handleSearchInput() {
  const searchTerm = searchInput.value.toLowerCase();
  const taskElements = taskList.querySelectorAll('.task-card');
  taskElements.forEach(taskElement => {
    const h3 = taskElement.querySelector('h3');
    const taskName = h3 ? h3.textContent.toLowerCase() : '';
    const descEl = taskElement.querySelector('.task-description');
    const taskDescription = descEl ? descEl.textContent.toLowerCase() : '';
    if (taskName.includes(searchTerm) || taskDescription.includes(searchTerm)) {
      taskElement.style.display = 'block';
    } else {
      taskElement.style.display = 'none';
    }
  });

  // Graph highlighting
  if (cy) {
    cy.batch(() => {
      cy.nodes().forEach(node => {
        const label = (node.data('label') || '').toLowerCase();
        if (searchTerm !== '' && label.includes(searchTerm)) {
          node.addClass('search-highlight');
        } else {
          node.removeClass('search-highlight');
        }
      });
      cy.edges().forEach(edge => {
        // highlight edge if either source or target is highlighted
        const src = edge.data('source');
        const tgt = edge.data('target');
        const srcNode = cy.getElementById(src);
        const tgtNode = cy.getElementById(tgt);
        if ((srcNode && srcNode.hasClass('search-highlight')) || (tgtNode && tgtNode.hasClass('search-highlight'))) {
          edge.addClass('search-highlight');
        } else {
          edge.removeClass('search-highlight');
        }
      });
    });
  }
}

// Switch between tabs
function switchTab(tabName) {
  tabButtons.forEach(button => {
    if (button.dataset.tab === tabName) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  tabContents.forEach(content => {
    if (content.id === tabName) {
      content.classList.add('active');
      if (tabName === 'dependency-graph') {
        updateGraph();
      } else if (tabName === 'timeline-view') {
        updateTimeline();
      }
    } else {
      content.classList.remove('active');
    }
  });
}

// Render tasks in the task list
function renderTasks() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<p>No tasks yet. Add a task to get started.</p>';
    return;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  tasks.forEach(task => {
    const taskDeadline = new Date(task.deadline);
    const isOverdue = taskDeadline < today;
    const dependencyNames = (task.dependencies || []).map(depId => {
      const dep = tasks.find(t => t.id === depId);
      return dep ? dep.name : 'Unknown';
    });
    const taskElement = document.createElement('div');
    taskElement.className = `task-card ${isOverdue ? 'overdue' : ''}`;
    taskElement.innerHTML = `
      <h3>
        ${task.name}
        <div class="task-actions">
          <button type="button" class="edit" aria-label="Edit task" title="Edit" data-id="${task.id}">${Icons.pencil}</button>
          <button type="button" class="delete" aria-label="Delete task" title="Delete" data-id="${task.id}">${Icons.trash}</button>
        </div>
      </h3>
      <div class="task-meta">
        <span class="task-priority priority-${task.priority || 'medium'}">${(task.priority || 'medium').toUpperCase()}</span>
        <span class="task-status status-${task.status || 'not-started'}">${(task.status || 'not-started').replace('-', ' ').toUpperCase()}</span>
        <span>Deadline: ${formatDate(task.deadline)}</span>
        <span>Duration: ${task.duration || 1}d</span>
      </div>
      <div class="task-dependencies">
        ${dependencyNames.length > 0 ? `<strong>Dependencies:</strong> ${dependencyNames.map(name => `<span>${name}</span>`).join('')}` : '<strong>No dependencies</strong>'}
      </div>
    `;
    // Add event listeners for edit and delete buttons
    const editButton = taskElement.querySelector('.edit');
    const deleteButton = taskElement.querySelector('.delete');
    editButton.addEventListener('click', () => openEditModal(task.id));
    deleteButton.addEventListener('click', () => deleteTask(task.id));
    taskList.appendChild(taskElement);
  });
}

// Open edit modal with task data
function openEditModal(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  document.getElementById('edit-task-id').value = task.id;
  document.getElementById('edit-task-name').value = task.name;
  document.getElementById('edit-task-deadline').value = task.deadline;
  if (document.getElementById('edit-task-duration')) document.getElementById('edit-task-duration').value = task.duration || 1;
  // Populate dependencies dropdown
  updateEditDependencySelect(task.id);
  // Select current dependencies (multiple)
  Array.from(editDependencySelect.options).forEach(option => {
    option.selected = (task.dependencies || []).includes(option.value);
  });
  document.getElementById('edit-task-priority').value = task.priority || 'medium';
  document.getElementById('edit-task-status').value = task.status || 'not-started';
  modal.style.display = 'block';
}

// Delete a task
function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  // Check if any other task depends on this task
  const dependentTasks = tasks.filter(task => (task.dependencies || []).includes(taskId));
  if (dependentTasks.length > 0) {
    const dependentTaskNames = dependentTasks.map(task => task.name).join(', ');
    alert(`Cannot delete this task because the following tasks depend on it: ${dependentTaskNames}`);
    return;
  }
  // Remove task and update UI
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasksToLocalStorage();
  renderTasks();
  updateDependencySelects();
  updateGraph();
  updateTimeline();
}

// Update dependency select dropdowns
function updateDependencySelects() {
  // Clear existing options
  dependencySelect.innerHTML = '';
  // Add options for each previously added task, sorted by creation time
  const sorted = [...tasks].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  sorted.forEach(task => {
    const option = document.createElement('option');
    option.value = task.id;
    option.textContent = task.name;
    dependencySelect.appendChild(option);
  });
}

// Update edit dependency select dropdown (excluding the current task)
function updateEditDependencySelect(currentTaskId) {
  // Clear existing options
  editDependencySelect.innerHTML = '';
  // Add options for each task except the current one
  const sorted = [...tasks].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  sorted.forEach(task => {
    if (task.id !== currentTaskId) {
      const option = document.createElement('option');
      option.value = task.id;
      option.textContent = task.name;
      editDependencySelect.appendChild(option);
    }
  });
}

// Build adjacency list used by cycle detection & older utilities
function createAdjacencyList(taskList) {
  const adjacencyList = {};
  // Initialize adjacency list for all tasks
  taskList.forEach(task => { adjacencyList[task.id] = []; });
  // Add dependencies as edges dep -> task
  taskList.forEach(task => {
    (task.dependencies || []).forEach(depId => {
      if (!(depId in adjacencyList)) adjacencyList[depId] = [];
      adjacencyList[depId].push(task.id);
    });
  });
  return adjacencyList;
}

// Detect cycles in the graph using DFS
function hasCycle(adjacencyList) {
  const visited = {};
  const recStack = {};
  Object.keys(adjacencyList).forEach(nodeId => { visited[nodeId] = false; recStack[nodeId] = false; });

  function dfs(nodeId) {
    visited[nodeId] = true;
    recStack[nodeId] = true;
    for (const adjacentId of (adjacencyList[nodeId] || [])) {
      if (!visited[adjacentId] && dfs(adjacentId)) return true;
      else if (recStack[adjacentId]) return true;
    }
    recStack[nodeId] = false;
    return false;
  }

  for (const nodeId in adjacencyList) {
    if (!visited[nodeId] && dfs(nodeId)) return true;
  }
  return false;
}

/**
 * findCriticalPath(tasksList)
 * - Uses durations (task.duration) as weights (default 1)
 * - Returns an array of node ids representing the longest path (by total duration)
 */
function findCriticalPath(tasksList = tasks) {
  if (!Array.isArray(tasksList) || tasksList.length === 0) return [];

  // Build adjacency: node -> [neighbors] , edges: dep -> task
  const adj = {};
  const indeg = {};
  tasksList.forEach(t => { adj[t.id] = []; indeg[t.id] = 0; });

  tasksList.forEach(t => {
    (t.dependencies || []).forEach(depId => {
      if (!(depId in adj)) { adj[depId] = []; indeg[depId] = indeg[depId] || 0; }
      adj[depId].push(t.id);
      indeg[t.id] = (indeg[t.id] || 0) + 1;
    });
  });

  // Kahn's algorithm for topological order
  const q = [];
  Object.keys(indeg).forEach(nodeId => { if (indeg[nodeId] === 0) q.push(nodeId); });
  const topo = [];
  while (q.length) {
    const n = q.shift();
    topo.push(n);
    (adj[n] || []).forEach(nei => { indeg[nei]--; if (indeg[nei] === 0) q.push(nei); });
  }

  // if cycle detected
  if (topo.length !== Object.keys(adj).length) return [];

  // DP: dist[node] = max total duration starting at node (including node)
  const dist = {};
  const nextNode = {};
  Object.keys(adj).forEach(nodeId => { dist[nodeId] = (getTaskById(nodeId)?.duration || 1); nextNode[nodeId] = null; });

  // Process nodes in reverse topo
  for (let i = topo.length - 1; i >= 0; i--) {
    const node = topo[i];
    let best = dist[node]; // at least its own duration
    let bestNext = null;
    (adj[node] || []).forEach(nei => {
      const candidate = (getTaskById(node)?.duration || 1) + (dist[nei] || (getTaskById(nei)?.duration || 1));
      if (candidate > best) { best = candidate; bestNext = nei; }
    });
    dist[node] = best;
    nextNode[node] = bestNext;
  }

  // find start node maximizing dist
  let maxNode = null;
  let maxVal = -Infinity;
  Object.keys(dist).forEach(nodeId => {
    if (dist[nodeId] > maxVal) { maxVal = dist[nodeId]; maxNode = nodeId; }
  });
  if (!maxNode) return [];

  // reconstruct path
  const path = [];
  let cur = maxNode;
  while (cur) {
    path.push(cur);
    cur = nextNode[cur];
  }
  return path;
}

function highlightCriticalPath(path = []) {
  if (!cy) return;
  cy.elements().removeClass('critical');
  if (!Array.isArray(path) || path.length === 0) return;

  // highlight nodes
  path.forEach(id => {
    const node = cy.getElementById(id);
    if (node && node.length) node.addClass('critical');
  });
  // highlight edges connecting consecutive nodes
  for (let i = 0; i < path.length - 1; i++) {
    const src = path[i], tgt = path[i + 1];
    const e = cy.edges().filter(edge => edge.data('source') === src && edge.data('target') === tgt);
    if (e && e.length) e.addClass('critical');
  }
}

// Helper to quickly find a task by id
function getTaskById(id) {
  return tasks.find(t => t.id === id);
}

// Show floating tooltip near mouse for node
let _tooltipEl = null;
function showNodeTooltip(node) {
  removeNodeTooltip();
  const id = node.data('id');
  const task = getTaskById(id);
  if (!task) return;
  const content = `${task.name}\nDeadline: ${formatDate(task.deadline)}\nDuration: ${task.duration || 1} d\nPriority: ${(task.priority || 'medium').toUpperCase()}\nStatus: ${(task.status || 'not-started').replace('-', ' ').toUpperCase()}`;
  _tooltipEl = document.createElement('div');
  _tooltipEl.id = 'cy-tooltip';
  _tooltipEl.textContent = content;
  Object.assign(_tooltipEl.style, {
    left: `${(window.innerWidth / 2)}px`, // placeholder position; we'll place near pointer if possible
    top: '80px'
  });
  document.body.appendChild(_tooltipEl);

  // Position it near the clicked position if available from last tap event
  // We'll try to use node rendered position
  try {
    const pos = node.renderedPosition();
    const rect = document.getElementById('cy').getBoundingClientRect();
    const left = rect.left + pos.x + 10;
    const top = rect.top + pos.y - 20;
    _tooltipEl.style.left = `${Math.max(8, left)}px`;
    _tooltipEl.style.top = `${Math.max(8, top)}px`;
  } catch (e) {
    // ignore; tooltip placed at fallback coords
  }

  // auto-remove after 5 seconds
  setTimeout(() => removeNodeTooltip(), 5000);
}

function removeNodeTooltip() {
  if (_tooltipEl && _tooltipEl.parentNode) _tooltipEl.parentNode.removeChild(_tooltipEl);
  _tooltipEl = null;
}

// Main update functions
function updateGraph() {
  if (!cy) return;
  // use batch to avoid intermediate empty graph flicker
  cy.batch(() => {
    cy.elements().remove();
    // Add nodes (tasks)
    tasks.forEach(task => {
      cy.add({
        data: {
          id: task.id,
          label: task.name
        }
      });
    });
    // Add edges (dependencies)
    tasks.forEach(task => {
      (task.dependencies || []).forEach(depId => {
        // defensive: only add edge if both nodes exist in cy
        if (cy.getElementById(depId).length && cy.getElementById(task.id).length) {
          cy.add({
            data: {
              id: `${depId}-${task.id}`,
              source: depId,
              target: task.id
            }
          });
        }
      });
    });
    // Mark overdue tasks
    const today = new Date(); today.setHours(0,0,0,0);
    tasks.forEach(task => {
      const node = cy.getElementById(task.id);
      try {
        const taskDeadline = new Date(task.deadline);
        if (taskDeadline < today) {
          if (node && node.length) node.addClass('overdue');
        } else {
          if (node && node.length) node.removeClass('overdue');
        }
      } catch (e) {}
    });
  });

  // Find and highlight critical path using durations
  const criticalNodePath = findCriticalPath(tasks);
  highlightCriticalPath(criticalNodePath);

  // Apply layout and fit
  try {
    cy.layout({
      name: 'dagre',
      rankDir: 'LR',
      nodeSep: 100,
      rankSep: 150,
      padding: 50
    }).run();
    setTimeout(() => { try { cy.resize(); cy.fit(); } catch(e){} }, 50);
  } catch (err) {
    // layout may throw if elements invalid; ignore
  }
}

// Update the timeline view
function updateTimeline() {
  const timelineContainer = document.getElementById('timeline-container');
  timelineContainer.innerHTML = '';
  if (tasks.length === 0) {
    timelineContainer.innerHTML = '<p>No tasks to display on the timeline.</p>';
    return;
  }
  // Sort tasks by deadline
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  // Find earliest and latest deadlines
  const earliestDeadline = new Date(sortedTasks[0].deadline);
  const latestDeadline = new Date(sortedTasks[sortedTasks.length - 1].deadline);
  // Add some padding days
  earliestDeadline.setDate(earliestDeadline.getDate() - 3);
  latestDeadline.setDate(latestDeadline.getDate() + 3);
  // Create timeline container
  const timeline = document.createElement('div');
  timeline.className = 'timeline';
  // Create ruler
  const ruler = document.createElement('div');
  ruler.className = 'timeline-ruler';
  // Calculate total time units and width based on zoom level
  let totalUnits, unitWidth, unitLabel;
  const totalDays = Math.ceil((latestDeadline - earliestDeadline) / (1000 * 60 * 60 * 24));

  switch (currentZoom) {
    case 'weeks':
      totalUnits = Math.ceil(totalDays / 7);
      unitWidth = Math.max(150, 1200 / totalUnits);
      unitLabel = 'week';
      break;
    case 'months':
      totalUnits = Math.ceil(totalDays / 30);
      unitWidth = Math.max(200, 1200 / totalUnits);
      unitLabel = 'month';
      break;
    default: // days
      totalUnits = totalDays;
      unitWidth = Math.max(100, 1200 / totalUnits);
      unitLabel = 'day';
  }

  ruler.style.width = `${unitWidth * totalUnits}px`;
  // Add time unit markers to ruler
  for (let i = 0; i <= totalUnits; i++) {
    const currentDate = new Date(earliestDeadline);
    switch (currentZoom) {
      case 'weeks':
        currentDate.setDate(currentDate.getDate() + (i * 7));
        break;
      case 'months':
        currentDate.setMonth(currentDate.getMonth() + i);
        break;
      default: // days
        currentDate.setDate(currentDate.getDate() + i);
    }

    const tick = document.createElement('div');
    tick.className = 'timeline-tick';
    tick.style.left = `${i * unitWidth}px`;

    const dateLabel = document.createElement('div');
    dateLabel.className = 'timeline-date';

    if (currentZoom === 'weeks') {
      dateLabel.textContent = `Week ${i + 1}`;
    } else if (currentZoom === 'months') {
      dateLabel.textContent = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      dateLabel.textContent = formatDate(currentDate.toISOString().split('T')[0]);
    }

    dateLabel.style.left = `${i * unitWidth}px`;
    ruler.appendChild(tick);
    ruler.appendChild(dateLabel);
  }
  timeline.appendChild(ruler);
  // Create tasks container
  const tasksContainer = document.createElement('div');
  tasksContainer.className = 'timeline-tasks';
  tasksContainer.style.height = `${tasks.length * 40 + 20}px`;

  // Get critical path nodes
  const criticalNodePath = findCriticalPath(tasks);
  const criticalTaskIds = new Set(criticalNodePath);

  // Add tasks to timeline
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  tasks.forEach((task, index) => {
    const taskDate = new Date(task.deadline);
    const daysDiff = Math.floor((taskDate - earliestDeadline) / (1000 * 60 * 60 * 24));

    let position;
    switch (currentZoom) {
      case 'weeks':
        position = Math.floor(daysDiff / 7) * unitWidth;
        break;
      case 'months':
        position = Math.floor(daysDiff / 30) * unitWidth;
        break;
      default: // days
        position = daysDiff * unitWidth;
    }

    const isCritical = criticalTaskIds.has(task.id);
    const isOverdue = taskDate < today;
    const taskElement = document.createElement('div');
    taskElement.className = `timeline-task ${isCritical ? 'critical' : ''} ${isOverdue ? 'overdue' : ''}`;
    taskElement.innerHTML = `
      <div class="task-name">${task.name}</div>
      <div class="task-priority priority-${task.priority || 'medium'}">${(task.priority || 'medium').toUpperCase()}</div>
      <div class="task-status status-${task.status || 'not-started'}">${(task.status || 'not-started').replace('-', ' ').toUpperCase()}</div>
    `;
    taskElement.style.left = `${position}px`;
    taskElement.style.top = `${index * 40 + 10}px`;
    // Add tooltip with task details
    taskElement.title = `${task.name}\nDeadline: ${formatDate(task.deadline)}\nDuration: ${task.duration || 1} d\nPriority: ${(task.priority || 'medium').toUpperCase()}\nStatus: ${(task.status || 'not-started').replace('-', ' ').toUpperCase()}`;
    tasksContainer.appendChild(taskElement);
  });
  timeline.appendChild(tasksContainer);
  timelineContainer.appendChild(timeline);
}

// Helper function to get a date string for n days from now
function getDateString(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Generate unique ID
function generateId() {
  return 'task_' + Math.random().toString(36).substr(2, 9);
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem('taskDependencyVisualizer', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('taskDependencyVisualizer');
  if (storedTasks) {
    try { tasks = JSON.parse(storedTasks); } catch (e) { tasks = []; }
  }
}

// Dark mode functionality
function toggleDarkMode() {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';

  if (isDark) {
    body.removeAttribute('data-theme');
    setDarkToggleLabel(false);
  } else {
    body.setAttribute('data-theme', 'dark');
    setDarkToggleLabel(true);
  }

  // Update Cytoscape background if possible
  if (cy) {
    try {
      cy.style().selector('core').style('background-color', isDark ? '#f5f7fa' : '#2d2d2d');
      cy.style().update();
    } catch (e) {}
  }
}

// Export functionality
function exportData() {
  const data = { tasks: tasks, exportDate: new Date().toISOString(), version: '1.0' };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `task-dependencies-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import functionality
function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.tasks && Array.isArray(data.tasks)) {
        tasks = data.tasks;
        saveTasksToLocalStorage();
        renderTasks();
        updateDependencySelects();
        updateGraph();
        updateTimeline();
        alert('Tasks imported successfully!');
      } else {
        alert('Invalid file format. Please select a valid task export file.');
      }
    } catch (error) {
      alert('Error reading file. Please check the file format.');
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // Reset file input
}

// Demo templates (including duration defaults)
function loadTemplate(templateType) {
  let templateTasks = [];
  switch (templateType) {
    case 'website':
      templateTasks = [
        { id: 'web1', name: 'Design Mockups', deadline: getDateString(3), duration: 2, dependencies: [], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'web2', name: 'Setup Development', deadline: getDateString(1), duration: 1, dependencies: [], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'web3', name: 'Frontend Development', deadline: getDateString(7), duration: 5, dependencies: ['web1', 'web2'], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'web4', name: 'Backend API', deadline: getDateString(10), duration: 6, dependencies: ['web2'], priority: 'medium', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'web5', name: 'Testing & QA', deadline: getDateString(14), duration: 3, dependencies: ['web3', 'web4'], priority: 'medium', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'web6', name: 'Deployment', deadline: getDateString(16), duration: 1, dependencies: ['web5'], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() }
      ];
      break;
    case 'event':
      templateTasks = [
        { id: 'evt1', name: 'Venue Booking', deadline: getDateString(2), duration: 1, dependencies: [], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'evt2', name: 'Catering Arrangement', deadline: getDateString(5), duration: 2, dependencies: ['evt1'], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'evt3', name: 'Guest List', deadline: getDateString(3), duration: 1, dependencies: [], priority: 'medium', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'evt4', name: 'Entertainment Setup', deadline: getDateString(7), duration: 2, dependencies: ['evt1'], priority: 'medium', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'evt5', name: 'Event Day Setup', deadline: getDateString(10), duration: 1, dependencies: ['evt2', 'evt3', 'evt4'], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() }
      ];
      break;
    case 'hospital':
      templateTasks = [
        { id: 'hosp1', name: 'Patient Registration', deadline: getDateString(1), duration: 1, dependencies: [], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'hosp2', name: 'Medical Tests', deadline: getDateString(3), duration: 2, dependencies: ['hosp1'], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'hosp3', name: 'Doctor Consultation', deadline: getDateString(5), duration: 1, dependencies: ['hosp2'], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'hosp4', name: 'Surgery Preparation', deadline: getDateString(6), duration: 2, dependencies: ['hosp3'], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'hosp5', name: 'Surgery', deadline: getDateString(7), duration: 1, dependencies: ['hosp4'], priority: 'high', status: 'not-started', createdAt: new Date().toISOString() },
        { id: 'hosp6', name: 'Post-op Care', deadline: getDateString(10), duration: 3, dependencies: ['hosp5'], priority: 'medium', status: 'not-started', createdAt: new Date().toISOString() }
      ];
      break;
  }

  tasks = templateTasks;
  saveTasksToLocalStorage();
  renderTasks();
  updateDependencySelects();
  updateGraph();
  updateTimeline();
  alert(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template loaded!`);
}

// Timeline zoom functionality
let currentZoom = 'days';
function setTimelineZoom(zoom) {
  currentZoom = zoom;
  document.querySelectorAll('.timeline-controls .btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById(`zoom-${zoom}`);
  if (btn) btn.classList.add('active');
  updateTimeline();
}

// Export graph as image
function exportGraphAsImage() {
  if (!cy) return;
  const png = cy.png({ output: 'blob-promise', bg: 'white', full: true, scale: 2 });
  png.then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-dependency-graph-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
