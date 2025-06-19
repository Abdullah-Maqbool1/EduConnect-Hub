   // Dashboard functionality
        class StudentDashboard {
            constructor() {
                this.initializeLocalStorage();
                this.bindEvents();
                this.updateDashboard();
            }

            initializeLocalStorage() {
                // Initialize default data if not exists
                if (!localStorage.getItem('studentData')) {
                    const defaultData = {
                        stats: {
                            totalCourses: 12,
                            pendingFeedback: 3,
                            libraryResources: 45,
                            thisMonth: 8
                        },
                        activities: [
                            { title: 'Data Structures Assignment', time: '2 hours ago', type: 'orange' },
                            { title: 'Feedback on Prof. Smith', time: '1 day ago', type: 'gray' },
                            { title: 'Algorithm Notes.pdf', time: '2 days ago', type: 'green' },
                            { title: 'Database Project', time: '3 days ago', type: 'orange' },
                            { title: 'Calculus Midterm Results', time: '5 days ago', type: 'green' },
                            { title: 'Physics Lab Report Submitted', time: '1 week ago', type: 'gray' }
                        ],
                        courses: [
                            { name: 'Data Structures', progress: 85, color: 'orange' },
                            { name: 'Database Systems', progress: 72, color: 'blue' },
                            { name: 'Web Development', progress: 94, color: 'green' },
                            { name: 'Algorithms', progress: 58, color: 'orange' },
                            { name: 'Software Engineering', progress: 67, color: 'blue' }
                        ],
                        achievements: [
                            { title: 'Top Contributor', desc: 'Most uploads this month', icon: 'trophy' },
                            { title: 'Active Learner', desc: '50+ downloads', icon: 'book' },
                            { title: 'Community Helper', desc: 'Helpful feedback', icon: 'hands-helping' }
                        ]
                    };
                    localStorage.setItem('studentData', JSON.stringify(defaultData));
                }
            }

            bindEvents() {
                // Notification click
                document.querySelector('.notification-btn').addEventListener('click', () => {
                    this.showNotifications();
                });

                // Quick action buttons
                document.querySelectorAll('button').forEach(btn => {
                    if (btn.textContent.includes('Upload Material')) {
                        btn.addEventListener('click', () => this.uploadMaterial());
                    } else if (btn.textContent.includes('Submit Feedback')) {
                        btn.addEventListener('click', () => this.submitFeedback());
                    } else if (btn.textContent.includes('Browse Library')) {
                        btn.addEventListener('click', () => this.browseLibrary());
                    }
                });
            }

            updateDashboard() {
                const data = JSON.parse(localStorage.getItem('studentData'));
                
                // Update stats
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers[0].textContent = data.stats.totalCourses;
                statNumbers[1].textContent = data.stats.pendingFeedback;
                statNumbers[2].textContent = data.stats.libraryResources;
                statNumbers[3].textContent = data.stats.thisMonth;

                // Update notification badge
                document.querySelector('.notification-badge').textContent = data.stats.pendingFeedback;
            }

            showNotifications() {
                alert('📢 Notifications:\n\n• New assignment in Data Structures\n• Feedback pending for Prof. Smith\n• Library book due tomorrow');
            }

            uploadMaterial() {
                const data = JSON.parse(localStorage.getItem('studentData'));
                
                // Simulate file upload
                const newActivity = {
                    title: 'New Material Uploaded',
                    time: 'Just now',
                    type: 'green'
                };
                
                data.activities.unshift(newActivity);
                localStorage.setItem('studentData', JSON.stringify(data));
                
                // Update UI
                this.refreshActivityList();
                alert('✅ Material uploaded successfully!');
            }

            submitFeedback() {
                const data = JSON.parse(localStorage.getItem('studentData'));
                
                // Simulate feedback submission
                const newActivity = {
                    title: 'Feedback Submitted',
                    time: 'Just now',
                    type: 'blue'
                };
                
                data.activities.unshift(newActivity);
                data.stats.pendingFeedback = Math.max(0, data.stats.pendingFeedback - 1);
                localStorage.setItem('studentData', JSON.stringify(data));
                
                // Update UI
                this.refreshActivityList();
                this.updateDashboard();
                alert('📝 Feedback submitted successfully!');
            }

            browseLibrary() {
                alert('📚 Redirecting to Library...\n\nAvailable resources:\n• Research Papers\n• E-books\n• Video Lectures\n• Past Exam Papers');
            }

            refreshActivityList() {
                const data = JSON.parse(localStorage.getItem('studentData'));
                const activityContainer = document.querySelector('.scrollable-content');
                
                activityContainer.innerHTML = '';
                
                data.activities.forEach(activity => {
                    const activityItem = document.createElement('div');
                    activityItem.className = 'activity-item';
                    activityItem.innerHTML = `
                        <div class="activity-dot ${activity.type}"></div>
                        <div class="activity-content">
                            <div class="activity-title">${activity.title}</div>
                            <div class="activity-time">${activity.time}</div>
                        </div>
                    `;
                    activityContainer.appendChild(activityItem);
                });
            }

            // Method to add new course
            addCourse(courseName, initialProgress = 0) {
                const data = JSON.parse(localStorage.getItem('studentData'));
                const colors = ['orange', 'blue', 'green'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                const newCourse = {
                    name: courseName,
                    progress: initialProgress,
                    color: randomColor
                };
                
                data.courses.push(newCourse);
                data.stats.totalCourses++;
                localStorage.setItem('studentData', JSON.stringify(data));
                
                this.updateDashboard();
                this.refreshCourseProgress();
            }

            // Method to update course progress
            updateCourseProgress(courseName, newProgress) {
                const data = JSON.parse(localStorage.getItem('studentData'));
                const course = data.courses.find(c => c.name === courseName);
                
                if (course) {
                    course.progress = newProgress;
                    localStorage.setItem('studentData', JSON.stringify(data));
                    this.refreshCourseProgress();
                }
            }

            refreshCourseProgress() {
                const data = JSON.parse(localStorage.getItem('studentData'));
                const progressContainer = document.querySelectorAll('.scrollable-content')[1];
                
                progressContainer.innerHTML = '';
                
                data.courses.forEach(course => {
                    const progressItem = document.createElement('div');
                    progressItem.className = 'progress-item';
                    progressItem.innerHTML = `
                        <div class="progress-header">
                            <span class="progress-course">${course.name}</span>
                            <span class="progress-percentage">${course.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${course.color}" style="width: ${course.progress}%"></div>
                        </div>
                    `;
                    progressContainer.appendChild(progressItem);
                });
            }

            // Method to simulate course completion
            completeCourse(courseName) {
                this.updateCourseProgress(courseName, 100);
                
                const data = JSON.parse(localStorage.getItem('studentData'));
                const newActivity = {
                    title: `${courseName} Course Completed! 🎉`,
                    time: 'Just now',
                    type: 'green'
                };
                
                data.activities.unshift(newActivity);
                localStorage.setItem('studentData', JSON.stringify(data));
                this.refreshActivityList();
            }
        }

        // Initialize dashboard when page loads
        document.addEventListener('DOMContentLoaded', () => {
            const dashboard = new StudentDashboard();
            
            // Make dashboard globally accessible for testing
            window.dashboard = dashboard;
            
            // Auto-update progress bars animation
            setTimeout(() => {
                const progressBars = document.querySelectorAll('.progress-fill');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }, 500);

            // Add some interactive features
            document.querySelectorAll('.stat-card').forEach(card => {
                card.addEventListener('click', function() {
                    const title = this.querySelector('.stat-title').textContent;
                    const number = this.querySelector('.stat-number').textContent;
                    
                    switch(title) {
                        case 'Total Courses':
                            alert(`📚 Total Courses: ${number}\n\nActive courses in your dashboard. Click on Course Progress to see detailed information.`);
                            break;
                        case 'Pending Feedback':
                            alert(`📝 Pending Feedback: ${number}\n\nYou have ${number} feedback forms to complete. Click 'Submit Feedback' to get started.`);
                            break;
                        case 'Library Resources':
                            alert(`📖 Library Resources: ${number}\n\nDigital resources available in your library. Click 'Browse Library' to explore.`);
                            break;
                        case 'This Month':
                            alert(`📊 This Month: ${number}\n\nActivities completed this month. Keep up the great work!`);
                            break;
                    }
                });
            });

            // Add hover effects to progress bars
            document.querySelectorAll('.progress-item').forEach(item => {
                item.addEventListener('mouseenter', function() {
                    const progressBar = this.querySelector('.progress-fill');
                    progressBar.style.transform = 'scaleY(1.2)';
                    progressBar.style.transition = 'transform 0.3s ease';
                });
                
                item.addEventListener('mouseleave', function() {
                    const progressBar = this.querySelector('.progress-fill');
                    progressBar.style.transform = 'scaleY(1)';
                });
            });

            // Add click functionality to achievements
            document.querySelectorAll('.achievement-item').forEach(item => {
                item.addEventListener('click', function() {
                    const title = this.querySelector('.achievement-title').textContent;
                    const desc = this.querySelector('.achievement-desc').textContent;
                    alert(`🏆 Achievement: ${title}\n\n${desc}\n\nCongratulations on your accomplishment!`);
                });
            });

            // Simulate real-time updates every 30 seconds
            setInterval(() => {
                // Randomly update some stats to simulate activity
                const data = JSON.parse(localStorage.getItem('studentData'));
                
                // Occasionally add a new activity
                if (Math.random() < 0.3) {
                    const activities = [
                        'New assignment posted',
                        'Grade updated',
                        'New library resource added',
                        'Reminder: Assignment due soon'
                    ];
                    
                    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
                    const newActivity = {
                        title: randomActivity,
                        time: 'Just now',
                        type: ['orange', 'blue', 'green', 'gray'][Math.floor(Math.random() * 4)]
                    };
                    
                    data.activities.unshift(newActivity);
                    if (data.activities.length > 10) {
                        data.activities.pop(); // Keep only last 10 activities
                    }
                    
                    localStorage.setItem('studentData', JSON.stringify(data));
                    dashboard.refreshActivityList();
                }
                
                // Occasionally update course progress
                if (Math.random() < 0.2) {
                    const randomCourse = data.courses[Math.floor(Math.random() * data.courses.length)];
                    if (randomCourse.progress < 100) {
                        randomCourse.progress = Math.min(100, randomCourse.progress + Math.floor(Math.random() * 5) + 1);
                        localStorage.setItem('studentData', JSON.stringify(data));
                        dashboard.refreshCourseProgress();
                    }
                }
            }, 30000); // Update every 30 seconds

            console.log('🎓 EduConnect Hub Student Dashboard loaded successfully!');
            console.log('💡 Try these commands in console:');
            console.log('   dashboard.addCourse("Machine Learning", 25)');
            console.log('   dashboard.updateCourseProgress("Data Structures", 90)');
            console.log('   dashboard.completeCourse("Web Development")');
        });


