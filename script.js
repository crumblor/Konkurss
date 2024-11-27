 // Get the link element and button
 const stylesheet = document.getElementById('stylesheet');
 const switchButton = document.getElementById('switchButton');

 // Boolean to track the current active style
 let usingStyle1 = true;

 // Add event listener to the button to switch the CSS file
 switchButton.addEventListener('click', () => {
     if (usingStyle1) {
         // Switch to style2.css
         stylesheet.href = 'styles.css';
     } else {
         // Switch back to style1.css
         stylesheet.href = 'light.css';
     }

     // Toggle the state
     usingStyle1 = !usingStyle1;
    });


var acc = document.getElementsByClassName("accordion");
        for (var i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });
        }





        
        const totalPieces = 15; // Number of puzzle pieces
        const puzzleGrid = document.querySelector('.puzzle-grid');
        let timerInterval;
        let seconds = 0; // Timer variable
        let timerRunning = false; // To track if the timer is running
        
        // Array to hold the pieces and their correct positions
        const pieces = [
            'puzzle/puzzle/piece_0_0.png', 'puzzle/puzzle/piece_0_1.png', 'puzzle/puzzle/piece_0_2.png',
            'puzzle/puzzle/piece_0_3.png', 'puzzle/puzzle/piece_0_4.png', 'puzzle/puzzle/piece_1_0.png',
            'puzzle/puzzle/piece_1_1.png', 'puzzle/puzzle/piece_1_2.png', 'puzzle/puzzle/piece_1_3.png',
            'puzzle/puzzle/piece_1_4.png', 'puzzle/puzzle/piece_2_0.png', 'puzzle/puzzle/piece_2_1.png',
            'puzzle/puzzle/piece_2_2.png', 'puzzle/puzzle/piece_2_3.png', 'puzzle/puzzle/piece_2_4.png'
        ];
        
        // Shuffle function to randomize the pieces
        function shuffleArray(arr) {
            return arr.sort(() => Math.random() - 0.5);
        }
        
        // Create the puzzle pieces dynamically and place them in correct spots
        function createPuzzlePieces() {
            const shuffledPieces = shuffleArray([...pieces]);
        
            shuffledPieces.forEach((pieceSrc, index) => {
                const piece = document.createElement('div');
                piece.classList.add('puzzle-piece');
                piece.style.backgroundImage = `url(${pieceSrc})`;
                piece.setAttribute('data-index', index);
        
                // Calculate the row and column based on index (for 3 rows, 5 columns)
                const row = Math.floor(index / 5); // 0, 1, 2 (rows)
                const col = index % 5;            // 0 to 4 (columns)
        
                // Use CSS Grid placement (no manual left/top needed)
                piece.style.gridRow = row + 1;  // Grid row (1-based index)
                piece.style.gridColumn = col + 1;  // Grid column (1-based index)
        
                piece.setAttribute('data-original-row', row);
                piece.setAttribute('data-original-col', col);
        
                piece.setAttribute('draggable', true);
                piece.addEventListener('dragstart', handleDragStart);
                piece.addEventListener('dragover', handleDragOver);
                piece.addEventListener('drop', handleDrop);
        
                puzzleGrid.appendChild(piece);
            });
        }
        
        // Handle the drag start event
        function handleDragStart(event) {
            if (!timerRunning) {
                startTimer(); // Start the timer the first time a piece is dragged
            }
            event.dataTransfer.setData('text', event.target.getAttribute('data-index'));
            event.target.classList.add('dragging');
        }
        
        // Handle the drag over event to allow dropping
        function handleDragOver(event) {
            event.preventDefault(); // Allow the drop by preventing the default behavior
        }
        
        // Handle the drop event when a piece is placed
        function handleDrop(event) {
            event.preventDefault();
        
            const draggedIndex = event.dataTransfer.getData('text');
            const draggedPiece = document.querySelector(`[data-index="${draggedIndex}"]`);
            const targetPiece = event.target;
        
            if (targetPiece.classList.contains('puzzle-piece') && draggedPiece !== targetPiece) {
                const draggedPieceIndex = draggedPiece.getAttribute('data-index');
                const targetPieceIndex = targetPiece.getAttribute('data-index');
        
                draggedPiece.setAttribute('data-index', targetPieceIndex);
                targetPiece.setAttribute('data-index', draggedPieceIndex);
        
                // Swap grid positions
                const draggedPiecePosition = {
                    gridRow: draggedPiece.style.gridRow,
                    gridColumn: draggedPiece.style.gridColumn
                };
                draggedPiece.style.gridRow = targetPiece.style.gridRow;
                draggedPiece.style.gridColumn = targetPiece.style.gridColumn;
                targetPiece.style.gridRow = draggedPiecePosition.gridRow;
                targetPiece.style.gridColumn = draggedPiecePosition.gridColumn;
            }
        
            checkPuzzleSolved(); // Check for completion after each drop
        }
        
        // Check if all pieces are in the correct place
        function checkPuzzleSolved() {
            const allPieces = document.querySelectorAll('.puzzle-piece');
            let solved = true;
        
            allPieces.forEach(piece => {
                const originalRow = parseInt(piece.getAttribute('data-original-row'));
                const originalCol = parseInt(piece.getAttribute('data-original-col'));
        
                const currentRow = parseInt(piece.style.gridRow) - 1;  // 1-based to 0-based index
                const currentCol = parseInt(piece.style.gridColumn) - 1; // 1-based to 0-based index
        
                // Check if the piece is in the correct position
                if (originalRow !== currentRow || originalCol !== currentCol) {
                    solved = false;
                }
            });
        
            // If all pieces are in their correct place, show the button to submit the result
            if (solved) {
                stopTimer(); // Stop the timer when the puzzle is solved
                document.getElementById('completedButton').style.display = 'inline'; // Show the "I did the puzzle!" button
            }
        }
        
        // Start the timer
        function startTimer() {
            timerRunning = true;
            timerInterval = setInterval(() => {
                seconds++;
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                document.getElementById('timer').textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
            }, 1000);
        }
        
        // Stop the timer
        function stopTimer() {
            clearInterval(timerInterval);
            timerRunning = false;
        }
        
        // Handle the "I did the puzzle!" button click to send the results to PHP
        document.getElementById('completedButton').addEventListener('click', function() {
            const playerName = document.getElementById('playerName').value;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            const timeTaken = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        
            if (!playerName) {
                alert("Please enter your name!");
                return;
            }
        
            // Send the data to the PHP server using Fetch API
            fetch('submitPuzzleResult.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `name=${encodeURIComponent(playerName)}&time=${encodeURIComponent(timeTaken)}`
            })
            .then(response => response.text())
            .then(data => {
                console.log('Success:', data);
                alert('Your result has been saved!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Something went wrong. Please try again.');
            });
        });
        
        // Initialize the puzzle (pieces shuffled randomly)
        createPuzzlePieces();
        