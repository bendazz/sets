// Set Theory Learning Tool - JavaScript

class SetTheoryApp {
    constructor() {
        this.currentTab = 'venn';
        this.currentOperation = 'none';
        this.currentDifficulty = 'beginner';
        this.currentProblemIndex = 0;
        this.problems = this.generateProblems();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateVennDiagram();
        this.loadProblem();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Venn diagram controls
        document.getElementById('updateVenn').addEventListener('click', () => {
            this.updateVennDiagram();
        });

        document.querySelectorAll('.op-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentOperation = btn.dataset.op;
                this.updateVennDiagram();
            });
        });

        // Calculator controls
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.performCalculation(btn.dataset.calc);
            });
        });

        // Problem controls
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentDifficulty = btn.dataset.level;
                this.currentProblemIndex = 0;
                this.loadProblem();
            });
        });

        document.getElementById('checkAnswer').addEventListener('click', () => {
            this.checkAnswer();
        });

        document.getElementById('showSolution').addEventListener('click', () => {
            this.showSolution();
        });

        document.getElementById('nextProblem').addEventListener('click', () => {
            this.nextProblem();
        });

        document.getElementById('prevProblem').addEventListener('click', () => {
            this.prevProblem();
        });

        // Auto-update calculator when inputs change
        ['calcSetA', 'calcSetB', 'calcUniversal'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                document.getElementById('calcResults').textContent = 'Enter sets and click an operation button to see results.';
            });
        });
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        this.currentTab = tabName;
    }

    parseSet(input) {
        if (!input.trim()) return new Set();
        return new Set(input.split(',').map(item => item.trim()).filter(item => item !== ''));
    }

    setToString(set) {
        return `{${Array.from(set).sort().join(', ')}}`;
    }

    union(setA, setB) {
        return new Set([...setA, ...setB]);
    }

    intersection(setA, setB) {
        return new Set([...setA].filter(x => setB.has(x)));
    }

    difference(setA, setB) {
        return new Set([...setA].filter(x => !setB.has(x)));
    }

    complement(set, universal) {
        return new Set([...universal].filter(x => !set.has(x)));
    }

    symmetricDifference(setA, setB) {
        const diff1 = this.difference(setA, setB);
        const diff2 = this.difference(setB, setA);
        return this.union(diff1, diff2);
    }

    updateVennDiagram() {
        const setAInput = document.getElementById('setA').value;
        const setBInput = document.getElementById('setB').value;
        const universalInput = document.getElementById('universal').value;

        const setA = this.parseSet(setAInput);
        const setB = this.parseSet(setBInput);
        const universal = this.parseSet(universalInput);

        this.drawVennDiagram(setA, setB, universal);
    }

    drawVennDiagram(setA, setB, universal) {
        const svg = document.getElementById('vennSvg');
        const resultDiv = document.getElementById('operationResult');
        
        // Clear existing diagram
        svg.innerHTML = '';

        // Create background rectangle for universal set
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '10');
        rect.setAttribute('y', '10');
        rect.setAttribute('width', '480');
        rect.setAttribute('height', '380');
        rect.setAttribute('fill', '#f8fafc');
        rect.setAttribute('stroke', '#e5e7eb');
        rect.setAttribute('stroke-width', '2');
        svg.appendChild(rect);

        // Universal set label
        const uLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        uLabel.setAttribute('x', '20');
        uLabel.setAttribute('y', '30');
        uLabel.setAttribute('font-size', '16');
        uLabel.setAttribute('font-weight', 'bold');
        uLabel.setAttribute('fill', '#6b7280');
        uLabel.textContent = 'U';
        svg.appendChild(uLabel);

        // Create circles for sets A and B
        const circleA = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circleA.setAttribute('cx', '200');
        circleA.setAttribute('cy', '200');
        circleA.setAttribute('r', '80');
        circleA.setAttribute('fill', 'rgba(255, 107, 107, 0.3)');
        circleA.setAttribute('stroke', '#ff6b6b');
        circleA.setAttribute('stroke-width', '2');
        svg.appendChild(circleA);

        const circleB = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circleB.setAttribute('cx', '300');
        circleB.setAttribute('cy', '200');
        circleB.setAttribute('r', '80');
        circleB.setAttribute('fill', 'rgba(78, 205, 196, 0.3)');
        circleB.setAttribute('stroke', '#4ecdc4');
        circleB.setAttribute('stroke-width', '2');
        svg.appendChild(circleB);

        // Add labels for sets
        const labelA = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelA.setAttribute('x', '150');
        labelA.setAttribute('y', '150');
        labelA.setAttribute('font-size', '18');
        labelA.setAttribute('font-weight', 'bold');
        labelA.setAttribute('fill', '#ff6b6b');
        labelA.textContent = 'A';
        svg.appendChild(labelA);

        const labelB = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelB.setAttribute('x', '330');
        labelB.setAttribute('y', '150');
        labelB.setAttribute('font-size', '18');
        labelB.setAttribute('font-weight', 'bold');
        labelB.setAttribute('fill', '#4ecdc4');
        labelB.textContent = 'B';
        svg.appendChild(labelB);

        // Calculate intersections
        const intersection = this.intersection(setA, setB);
        const onlyA = this.difference(setA, setB);
        const onlyB = this.difference(setB, setA);
        const outside = this.difference(universal, this.union(setA, setB));

        // Position elements
        this.addElementsToRegion(svg, Array.from(onlyA), 150, 200, '#ff6b6b');
        this.addElementsToRegion(svg, Array.from(intersection), 250, 200, '#8b5cf6');
        this.addElementsToRegion(svg, Array.from(onlyB), 350, 200, '#4ecdc4');
        this.addElementsToRegion(svg, Array.from(outside), 100, 100, '#6b7280');

        // Highlight based on current operation
        this.highlightOperation(setA, setB, universal, resultDiv);
    }

    addElementsToRegion(svg, elements, centerX, centerY, color) {
        elements.forEach((element, index) => {
            const angle = (index * 2 * Math.PI) / Math.max(elements.length, 1);
            const radius = 25;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', '500');
            text.setAttribute('fill', color);
            text.setAttribute('class', 'venn-element');
            text.textContent = element;
            svg.appendChild(text);
        });
    }

    highlightOperation(setA, setB, universal, resultDiv) {
        let result;
        let description;

        switch (this.currentOperation) {
            case 'none':
                result = null;
                description = `Set A: ${this.setToString(setA)}\nSet B: ${this.setToString(setB)}`;
                break;
            case 'union':
                result = this.union(setA, setB);
                description = `A ∪ B = ${this.setToString(result)}`;
                break;
            case 'intersection':
                result = this.intersection(setA, setB);
                description = `A ∩ B = ${this.setToString(result)}`;
                break;
            case 'difference':
                result = this.difference(setA, setB);
                description = `A - B = ${this.setToString(result)}`;
                break;
            case 'complement-a':
                result = this.complement(setA, universal);
                description = `A' = ${this.setToString(result)}`;
                break;
            case 'complement-b':
                result = this.complement(setB, universal);
                description = `B' = ${this.setToString(result)}`;
                break;
        }

        resultDiv.textContent = description;

        // Highlight elements in the result
        if (result) {
            const elements = document.querySelectorAll('.venn-element');
            elements.forEach(element => {
                if (result.has(element.textContent)) {
                    element.classList.add('highlight');
                } else {
                    element.classList.remove('highlight');
                }
            });
        }
    }

    performCalculation(operation) {
        const setAInput = document.getElementById('calcSetA').value;
        const setBInput = document.getElementById('calcSetB').value;
        const universalInput = document.getElementById('calcUniversal').value;

        const setA = this.parseSet(setAInput);
        const setB = this.parseSet(setBInput);
        const universal = this.parseSet(universalInput);

        const resultsDiv = document.getElementById('calcResults');
        let result;
        let description;

        switch (operation) {
            case 'union':
                result = this.union(setA, setB);
                description = `Union (A ∪ B):\n${this.setToString(result)}`;
                break;
            case 'intersection':
                result = this.intersection(setA, setB);
                description = `Intersection (A ∩ B):\n${this.setToString(result)}`;
                break;
            case 'difference':
                result = this.difference(setA, setB);
                description = `Difference (A - B):\n${this.setToString(result)}`;
                break;
            case 'symmetric':
                result = this.symmetricDifference(setA, setB);
                description = `Symmetric Difference (A ⊕ B):\n${this.setToString(result)}`;
                break;
            case 'complement-a':
                if (universal.size === 0) {
                    description = 'Please specify a universal set to calculate complements.';
                } else {
                    result = this.complement(setA, universal);
                    description = `Complement of A (A'):\n${this.setToString(result)}`;
                }
                break;
            case 'complement-b':
                if (universal.size === 0) {
                    description = 'Please specify a universal set to calculate complements.';
                } else {
                    result = this.complement(setB, universal);
                    description = `Complement of B (B'):\n${this.setToString(result)}`;
                }
                break;
        }

        resultsDiv.textContent = description;
    }

    generateProblems() {
        return {
            beginner: [
                {
                    text: "Find the union of sets A and B.",
                    sets: "A = {1, 2, 3, 4}\nB = {3, 4, 5, 6}",
                    answer: new Set(['1', '2', '3', '4', '5', '6']),
                    solution: "The union A ∪ B contains all elements that are in either set A or set B (or both).\nA ∪ B = {1, 2, 3, 4, 5, 6}"
                },
                {
                    text: "Find the intersection of sets A and B.",
                    sets: "A = {2, 4, 6, 8}\nB = {4, 8, 12, 16}",
                    answer: new Set(['4', '8']),
                    solution: "The intersection A ∩ B contains only elements that are in both set A and set B.\nA ∩ B = {4, 8}"
                },
                {
                    text: "Find A - B (elements in A but not in B).",
                    sets: "A = {1, 2, 3, 4, 5}\nB = {3, 4, 5, 6, 7}",
                    answer: new Set(['1', '2']),
                    solution: "A - B contains elements that are in A but not in B.\nA - B = {1, 2}"
                },
                {
                    text: "Find the complement of A with respect to the universal set U.",
                    sets: "A = {1, 3, 5}\nU = {1, 2, 3, 4, 5, 6}",
                    answer: new Set(['2', '4', '6']),
                    solution: "The complement A' contains all elements in the universal set U that are not in A.\nA' = {2, 4, 6}"
                },
                {
                    text: "Find B - A (elements in B but not in A).",
                    sets: "A = {a, b, c}\nB = {b, c, d, e}",
                    answer: new Set(['d', 'e']),
                    solution: "B - A contains elements that are in B but not in A.\nB - A = {d, e}"
                }
            ],
            intermediate: [
                {
                    text: "Find (A ∪ B) ∩ C.",
                    sets: "A = {1, 2, 3}\nB = {3, 4, 5}\nC = {2, 3, 4, 6}",
                    answer: new Set(['2', '3', '4']),
                    solution: "First find A ∪ B = {1, 2, 3, 4, 5}\nThen find (A ∪ B) ∩ C = {2, 3, 4}"
                },
                {
                    text: "Find A ∩ (B ∪ C).",
                    sets: "A = {1, 2, 3, 4}\nB = {3, 4, 5}\nC = {4, 5, 6}",
                    answer: new Set(['3', '4']),
                    solution: "First find B ∪ C = {3, 4, 5, 6}\nThen find A ∩ (B ∪ C) = {3, 4}"
                },
                {
                    text: "Find the symmetric difference A ⊕ B.",
                    sets: "A = {1, 2, 3, 4}\nB = {3, 4, 5, 6}",
                    answer: new Set(['1', '2', '5', '6']),
                    solution: "Symmetric difference A ⊕ B = (A - B) ∪ (B - A)\nA - B = {1, 2}, B - A = {5, 6}\nSo A ⊕ B = {1, 2, 5, 6}"
                },
                {
                    text: "Find A' ∩ B where U = {1, 2, 3, 4, 5, 6, 7, 8}.",
                    sets: "A = {1, 3, 5, 7}\nB = {2, 4, 6, 8}\nU = {1, 2, 3, 4, 5, 6, 7, 8}",
                    answer: new Set(['2', '4', '6', '8']),
                    solution: "First find A' = {2, 4, 6, 8}\nThen find A' ∩ B = {2, 4, 6, 8}"
                },
                {
                    text: "Find (A ∩ B)'.",
                    sets: "A = {a, b, c, d}\nB = {c, d, e, f}\nU = {a, b, c, d, e, f, g}",
                    answer: new Set(['a', 'b', 'e', 'f', 'g']),
                    solution: "First find A ∩ B = {c, d}\nThen find (A ∩ B)' = {a, b, e, f, g}"
                }
            ],
            advanced: [
                {
                    text: "Verify De Morgan's Law: (A ∪ B)' = A' ∩ B'. Find both sides.",
                    sets: "A = {1, 2, 3}\nB = {3, 4, 5}\nU = {1, 2, 3, 4, 5, 6}",
                    answer: new Set(['6']),
                    solution: "Left side: A ∪ B = {1, 2, 3, 4, 5}, so (A ∪ B)' = {6}\nRight side: A' = {4, 5, 6}, B' = {1, 2, 6}, so A' ∩ B' = {6}\nBoth sides equal {6}, verifying De Morgan's Law."
                },
                {
                    text: "Find A ∩ (B ⊕ C) where ⊕ is symmetric difference.",
                    sets: "A = {1, 2, 3, 4, 5}\nB = {2, 3, 4}\nC = {3, 4, 5, 6}",
                    answer: new Set(['2', '5']),
                    solution: "First find B ⊕ C = (B - C) ∪ (C - B) = {2} ∪ {5, 6} = {2, 5, 6}\nThen A ∩ (B ⊕ C) = {2, 5}"
                },
                {
                    text: "Find (A - B) ∪ (B - A) and compare with A ⊕ B.",
                    sets: "A = {x, y, z}\nB = {y, z, w}",
                    answer: new Set(['x', 'w']),
                    solution: "A - B = {x}, B - A = {w}\n(A - B) ∪ (B - A) = {x, w}\nA ⊕ B = {x, w}\nThey are equal, as expected from the definition of symmetric difference."
                },
                {
                    text: "Prove that A ∩ (A ∪ B) = A by finding both sides.",
                    sets: "A = {2, 4, 6}\nB = {1, 3, 5, 6}",
                    answer: new Set(['2', '4', '6']),
                    solution: "A ∪ B = {1, 2, 3, 4, 5, 6}\nA ∩ (A ∪ B) = {2, 4, 6}\nThis equals A = {2, 4, 6}, proving the absorption law."
                },
                {
                    text: "Find A ∩ B ∩ C.",
                    sets: "A = {1, 2, 3, 4, 5, 6}\nB = {2, 4, 6, 8, 10}\nC = {3, 4, 5, 6, 7}",
                    answer: new Set(['4', '6']),
                    solution: "Find elements that appear in all three sets:\nA ∩ B ∩ C = {4, 6}"
                }
            ]
        };
    }

    loadProblem() {
        const problems = this.problems[this.currentDifficulty];
        const problem = problems[this.currentProblemIndex];

        document.getElementById('problemNumber').textContent = this.currentProblemIndex + 1;
        document.getElementById('problemText').textContent = problem.text;
        document.getElementById('problemSets').textContent = problem.sets;
        document.getElementById('studentAnswer').value = '';
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('solution').classList.add('hidden');

        // Update navigation buttons
        document.getElementById('prevProblem').disabled = this.currentProblemIndex === 0;
        document.getElementById('nextProblem').disabled = this.currentProblemIndex === problems.length - 1;
    }

    checkAnswer() {
        const problems = this.problems[this.currentDifficulty];
        const problem = problems[this.currentProblemIndex];
        const studentInput = document.getElementById('studentAnswer').value;
        const studentAnswer = this.parseSet(studentInput);
        const correctAnswer = problem.answer;

        const feedback = document.getElementById('feedback');
        
        // Compare sets by converting to arrays and sorting
        const studentArray = Array.from(studentAnswer).sort();
        const correctArray = Array.from(correctAnswer).sort();
        
        const isCorrect = studentArray.length === correctArray.length && 
                         studentArray.every((val, index) => val === correctArray[index]);

        if (isCorrect) {
            feedback.textContent = "🎉 Correct! Well done!";
            feedback.className = 'feedback correct';
        } else {
            feedback.textContent = `❌ Incorrect. Your answer: ${this.setToString(studentAnswer)}. Try again or view the solution.`;
            feedback.className = 'feedback incorrect';
        }
    }

    showSolution() {
        const problems = this.problems[this.currentDifficulty];
        const problem = problems[this.currentProblemIndex];
        const solution = document.getElementById('solution');
        
        solution.innerHTML = `
            <h5>Solution:</h5>
            <p>${problem.solution}</p>
            <p><strong>Answer: ${this.setToString(problem.answer)}</strong></p>
        `;
        solution.classList.remove('hidden');
    }

    nextProblem() {
        const problems = this.problems[this.currentDifficulty];
        if (this.currentProblemIndex < problems.length - 1) {
            this.currentProblemIndex++;
            this.loadProblem();
        }
    }

    prevProblem() {
        if (this.currentProblemIndex > 0) {
            this.currentProblemIndex--;
            this.loadProblem();
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SetTheoryApp();
});
