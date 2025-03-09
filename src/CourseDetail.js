import React, { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Chart from "chart.js/auto";
import "./App.css";

const CourseDetail = ({ courses }) => {
    const { courseId } = useParams();
    const course = courses.find(c => c.courseId === courseId);
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!course || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");

        // Destroy old chart instance before creating a new one
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: course.homeworkScores.map((_, index) => `Attempt ${index + 1}`),
                datasets: [
                    {
                        label: "Homework Scores",
                        data: course.homeworkScores,
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        pointBackgroundColor: "rgba(54, 162, 235, 1)",
                        pointBorderColor: "#fff",
                        pointRadius: 5,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                    },
                    {
                        label: "Exam Scores",
                        data: course.examScores,
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        pointBackgroundColor: "rgba(255, 99, 132, 1)",
                        pointBorderColor: "#fff",
                        pointRadius: 5,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: "#333",
                            font: { size: 14 }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        mode: "index",
                        intersect: false,
                        backgroundColor: "#fff",
                        titleColor: "#333",
                        bodyColor: "#333",
                        borderColor: "#ddd",
                        borderWidth: 1,
                        padding: 10,
                        titleFont: { size: 14 },
                        bodyFont: { size: 12 },
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: "Scores (%)",
                            color: "#333",
                            font: { size: 14 }
                        },
                        grid: { color: "rgba(0, 0, 0, 0.1)" },
                        ticks: { color: "#333" }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Attempts",
                            color: "#333",
                            font: { size: 14 }
                        },
                        grid: { color: "rgba(0, 0, 0, 0.1)" },
                        ticks: { color: "#333" }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: "easeInOutQuad"
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [course]);

    if (!course) {
        return <h2 className="error-message">Course not found!</h2>;
    }

    // Improvement Suggestions
    const avgHomework = (course.homeworkScores.reduce((a, b) => a + b, 0) / course.homeworkScores.length).toFixed(1);
    const avgExam = (course.examScores.reduce((a, b) => a + b, 0) / course.examScores.length).toFixed(1);

    const improvementMessage = avgExam < avgHomework 
        ? "Your exam scores are lower than your homework scores. Consider practicing timed exercises."
        : "Great job! Your exam scores are consistent with your homework performance.";

    return (
        <div className="course-detail-container">
            <h2>{course.courseName} - Detailed Progress</h2>
            <div className="chart-container">
                <canvas ref={canvasRef} id="progressChart"></canvas>
            </div>
            <div className="summary">
                <p><strong>Average Homework Score:</strong> {avgHomework}%</p>
                <p><strong>Average Exam Score:</strong> {avgExam}%</p>
                <p className="improvement-tip">{improvementMessage}</p>
            </div>
            <Link to="/dashboard" className="back-button">Back to Dashboard</Link>
        </div>
    );
};

export default CourseDetail;
