// JavaScript for Local Community Event Portal

// Global variables
let events = []
let userPreferences = {}
let currentRating = 0

// Event constructor/class
class Event {
  constructor(id, name, date, category, location, seats, fee, description) {
    this.id = id
    this.name = name
    this.date = new Date(date)
    this.category = category
    this.location = location
    this.seats = seats
    this.fee = fee
    this.description = description
  }

  // Check availability method
  checkAvailability() {
    return this.seats > 0 && this.date > new Date()
  }

  // Register user method
  registerUser() {
    if (this.checkAvailability()) {
      this.seats--
      return true
    }
    return false
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("Welcome to the Community Portal")

  // Initialize events
  initializeEvents()

  // Load user preferences
  loadUserPreferences()

  // Display events
  displayEvents()

  // Setup event listeners
  setupEventListeners()

  // Show welcome alert
  setTimeout(() => {
    if (!sessionStorage.getItem("welcomeShown")) {
      alert("Welcome! Explore our community events and register for activities.")
      sessionStorage.setItem("welcomeShown", "true")
    }
  }, 1000)
})

// Initialize sample events
function initializeEvents() {
  events = [
    new Event(
      1,
      "Summer Music Festival",
      "2024-07-15",
      "music",
      "Central Park",
      100,
      15,
      "Join us for an amazing outdoor music experience",
    ),
    new Event(
      2,
      "Cooking Workshop",
      "2024-06-20",
      "workshop",
      "Community Center",
      25,
      25,
      "Learn to cook delicious local dishes",
    ),
    new Event(
      3,
      "Basketball Tournament",
      "2024-06-25",
      "sports",
      "Sports Complex",
      50,
      10,
      "Annual community basketball championship",
    ),
    new Event(4, "Art Exhibition", "2024-07-01", "community", "Art Gallery", 75, 0, "Showcase of local artists' work"),
    new Event(
      5,
      "Photography Workshop",
      "2024-06-30",
      "workshop",
      "Studio Downtown",
      15,
      25,
      "Master the art of digital photography",
    ),
  ]
}

// Display events dynamically
function displayEvents(filteredEvents = events) {
  const container = document.getElementById("eventsContainer")
  container.innerHTML = ""

  if (filteredEvents.length === 0) {
    container.innerHTML =
      '<div class="col-12 text-center"><p class="lead">No events found matching your criteria.</p></div>'
    return
  }

  filteredEvents.forEach((event) => {
    if (event.checkAvailability()) {
      const eventCard = createEventCard(event)
      container.appendChild(eventCard)
    }
  })
}

// Create event card element
function createEventCard(event) {
  const col = document.createElement("div")
  col.className = "col-md-6 col-lg-4 mb-4"

  const card = document.createElement("div")
  card.className = "card eventCard fade-in"

  const categoryColors = {
    music: "bg-primary",
    workshop: "bg-success",
    sports: "bg-warning",
    community: "bg-info",
  }

  card.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="card-title">${event.name}</h5>
                <span class="badge ${categoryColors[event.category] || "bg-secondary"}">${event.category}</span>
            </div>
            <p class="card-text">${event.description}</p>
            <div class="event-details">
                <p class="mb-2"><i class="bi bi-calendar"></i> ${event.date.toLocaleDateString()}</p>
                <p class="mb-2"><i class="bi bi-geo-alt"></i> ${event.location}</p>
                <p class="mb-2"><i class="bi bi-people"></i> ${event.seats} seats available</p>
                <p class="mb-3"><i class="bi bi-currency-dollar"></i> ${event.fee === 0 ? "Free" : "$" + event.fee}</p>
            </div>
            <button class="btn btn-primary w-100" onclick="registerForEvent(${event.id})">
                <i class="bi bi-check-circle"></i> Register Now
            </button>
        </div>
    `

  col.appendChild(card)
  return col
}

// Register for event
function registerForEvent(eventId) {
  const event = events.find((e) => e.id === eventId)
  if (event && event.registerUser()) {
    alert(`Successfully registered for ${event.name}!`)
    displayEvents() // Refresh display

    // Simulate API call
    simulateRegistrationAPI(event)
  } else {
    alert("Registration failed. Event may be full or no longer available.")
  }
}

// Simulate API call for registration
async function simulateRegistrationAPI(event) {
  try {
    // Show loading
    console.log("Sending registration data...")

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock API response
    const response = {
      success: true,
      message: `Registration confirmed for ${event.name}`,
      confirmationNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
    }

    console.log("Registration successful:", response)

    // Store in localStorage
    const registrations = JSON.parse(localStorage.getItem("registrations") || "[]")
    registrations.push({
      eventId: event.id,
      eventName: event.name,
      confirmationNumber: response.confirmationNumber,
      registrationDate: new Date().toISOString(),
    })
    localStorage.setItem("registrations", JSON.stringify(registrations))
  } catch (error) {
    console.error("Registration failed:", error)
    alert("Registration failed. Please try again.")
  }
}

// Filter events by category
function filterEvents() {
  const filterValue = document.getElementById("eventFilter").value
  let filteredEvents = events

  if (filterValue) {
    filteredEvents = events.filter((event) => event.category === filterValue)
  }

  displayEvents(filteredEvents)

  // Save preference
  userPreferences.preferredCategory = filterValue
  saveUserPreferences()
}

// Handle search functionality
function handleSearch(event) {
  if (event.key === "Enter") {
    const searchTerm = event.target.value.toLowerCase()
    const filteredEvents = events.filter(
      (e) =>
        e.name.toLowerCase().includes(searchTerm) ||
        e.description.toLowerCase().includes(searchTerm) ||
        e.location.toLowerCase().includes(searchTerm),
    )
    displayEvents(filteredEvents)
  }
}

// Setup event listeners
function setupEventListeners() {
  // Rating stars
  const stars = document.querySelectorAll(".star")
  stars.forEach((star) => {
    star.addEventListener("click", function () {
      currentRating = Number.parseInt(this.dataset.rating)
      updateStarDisplay()
    })

    star.addEventListener("mouseover", function () {
      const rating = Number.parseInt(this.dataset.rating)
      highlightStars(rating)
    })
  })

  // Form validation
  const forms = document.querySelectorAll(".needs-validation")
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add("was-validated")
    })
  })

  // Prevent leaving page with unsaved form data
  window.addEventListener("beforeunload", (event) => {
    const form = document.getElementById("registrationForm")
    const formData = new FormData(form)
    let hasData = false

    for (const [key, value] of formData.entries()) {
      if (value.trim() !== "") {
        hasData = true
        break
      }
    }

    if (hasData) {
      event.preventDefault()
      event.returnValue = "You have unsaved changes. Are you sure you want to leave?"
      return event.returnValue
    }
  })
}

// Update star display
function updateStarDisplay() {
  const stars = document.querySelectorAll(".star")
  stars.forEach((star, index) => {
    if (index < currentRating) {
      star.classList.add("active")
    } else {
      star.classList.remove("active")
    }
  })
}

// Highlight stars on hover
function highlightStars(rating) {
  const stars = document.querySelectorAll(".star")
  stars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = "#ffc107"
    } else {
      star.style.color = "#ddd"
    }
  })
}

// Phone validation
function validatePhone() {
  const phoneInput = document.getElementById("userPhone")
  const phoneError = document.getElementById("phoneError")
  const phonePattern = /^$$\d{3}$$\s\d{3}-\d{4}$/

  if (phoneInput.value && !phonePattern.test(phoneInput.value)) {
    phoneError.textContent = "Please enter phone in format: (555) 123-4567"
    phoneInput.classList.add("is-invalid")
  } else {
    phoneError.textContent = ""
    phoneInput.classList.remove("is-invalid")
  }
}

// Show event fee
function showEventFee() {
  const select = document.getElementById("eventType")
  const feeDiv = document.getElementById("eventFee")
  const selectedOption = select.options[select.selectedIndex]

  if (selectedOption.dataset.fee !== undefined) {
    const fee = selectedOption.dataset.fee
    feeDiv.innerHTML = `<strong>Event Fee: ${fee === "0" ? "Free" : "$" + fee}</strong>`
    feeDiv.className = "mt-2 text-info"

    // Save preference
    userPreferences.preferredEventType = select.value
    saveUserPreferences()
  } else {
    feeDiv.innerHTML = ""
  }
}

// Character counter
function countCharacters() {
  const textarea = document.getElementById("userMessage")
  const counter = document.getElementById("charCount")
  const count = textarea.value.length

  counter.textContent = `${count} characters`

  if (count > 500) {
    counter.className = "form-text text-danger"
    counter.textContent += " (Maximum 500 characters recommended)"
  } else {
    counter.className = "form-text text-muted"
  }
}

// Show confirmation
function showConfirmation(event) {
  event.preventDefault()

  const form = document.getElementById("registrationForm")
  if (form.checkValidity()) {
    const output = document.getElementById("confirmationMessage")
    const name = document.getElementById("userName").value
    const eventType =
      document.getElementById("eventType").options[document.getElementById("eventType").selectedIndex].text

    output.innerHTML = `
            <div class="alert alert-success">
                <i class="bi bi-check-circle"></i>
                <strong>Registration Confirmed!</strong><br>
                Thank you, ${name}! Your registration for ${eventType} has been submitted.
                <br>Confirmation number: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
        `

    // Reset form after successful submission
    setTimeout(() => {
      form.reset()
      output.innerHTML = ""
      form.classList.remove("was-validated")
    }, 5000)
  }
}

// Enlarge image on double-click
function enlargeImage(img) {
  const modal = new bootstrap.Modal(document.getElementById("imageModal"))
  const enlargedImg = document.getElementById("enlargedImage")

  enlargedImg.src = img.src
  enlargedImg.alt = img.alt

  modal.show()
}

// Video ready event
function videoReady() {
  const status = document.getElementById("videoStatus")
  status.innerHTML = '<i class="bi bi-check-circle"></i> Video ready to play!'
  status.className = "mt-2 text-success"
}

// Geolocation functionality
function findNearbyEvents() {
  const btn = document.getElementById("findNearbyBtn")
  const originalText = btn.innerHTML

  btn.innerHTML = '<i class="bi bi-geo-alt"></i> Finding location...'
  btn.disabled = true

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        alert(`Your location: ${lat.toFixed(4)}, ${lon.toFixed(4)}\nFinding nearby events...`)

        // Simulate finding nearby events
        setTimeout(() => {
          const nearbyEvents = events.filter((event) => Math.random() > 0.5)
          displayEvents(nearbyEvents)

          btn.innerHTML = originalText
          btn.disabled = false
        }, 1000)
      },
      (error) => {
        let errorMessage = "Unable to get your location. "

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Location access denied by user."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information unavailable."
            break
          case error.TIMEOUT:
            errorMessage += "Location request timed out."
            break
          default:
            errorMessage += "An unknown error occurred."
            break
        }

        alert(errorMessage)
        btn.innerHTML = originalText
        btn.disabled = false
      },
      options,
    )
  } else {
    alert("Geolocation is not supported by this browser.")
    btn.innerHTML = originalText
    btn.disabled = false
  }
}

// Add event listener to find nearby button
document.addEventListener("DOMContentLoaded", () => {
  const findBtn = document.getElementById("findNearbyBtn")
  if (findBtn) {
    findBtn.addEventListener("click", findNearbyEvents)
  }
})

// Local storage functions
function saveUserPreferences() {
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences))
}

function loadUserPreferences() {
  const saved = localStorage.getItem("userPreferences")
  if (saved) {
    userPreferences = JSON.parse(saved)

    // Apply saved preferences
    if (userPreferences.preferredCategory) {
      const filterSelect = document.getElementById("eventFilter")
      if (filterSelect) {
        filterSelect.value = userPreferences.preferredCategory
      }
    }

    if (userPreferences.preferredEventType) {
      const eventTypeSelect = document.getElementById("eventType")
      if (eventTypeSelect) {
        eventTypeSelect.value = userPreferences.preferredEventType
        showEventFee()
      }
    }
  }
}

function clearPreferences() {
  // Clear localStorage and sessionStorage
  localStorage.removeItem("userPreferences")
  localStorage.removeItem("registrations")
  sessionStorage.clear()

  // Reset form and preferences
  userPreferences = {}

  // Reset form fields
  const form = document.getElementById("registrationForm")
  if (form) {
    form.reset()
  }

  const filterSelect = document.getElementById("eventFilter")
  if (filterSelect) {
    filterSelect.value = ""
  }

  // Refresh events display
  displayEvents()

  alert("All preferences and data have been cleared.")
}

// Update feedback info
function updateFeedbackInfo() {
  const select = document.getElementById("feedbackEvent")
  const selectedEvent = select.value

  if (selectedEvent) {
    console.log(`Selected event for feedback: ${selectedEvent}`)
    // Here you could load specific event details for feedback
  }
}

// Higher-order function example - event filtering with callback
function filterEventsByCallback(callback) {
  return events.filter(callback)
}

// Example usage of higher-order function
function getUpcomingEvents() {
  return filterEventsByCallback((event) => event.checkAvailability())
}

function getMusicEvents() {
  return filterEventsByCallback((event) => event.category === "music")
}

// Closure example - registration counter
function createRegistrationCounter() {
  let totalRegistrations = 0

  return {
    increment: () => {
      totalRegistrations++
      return totalRegistrations
    },
    getTotal: () => totalRegistrations,
    reset: () => {
      totalRegistrations = 0
    },
  }
}

// Create registration counter instance
const registrationCounter = createRegistrationCounter()

// Array methods examples
function demonstrateArrayMethods() {
  // Map example - format event names
  const eventNames = events.map((event) => `${event.name} - ${event.category.toUpperCase()}`)
  console.log("Formatted event names:", eventNames)

  // Filter example - get workshop events
  const workshops = events.filter((event) => event.category === "workshop")
  console.log("Workshop events:", workshops)

  // Reduce example - calculate total revenue
  const totalRevenue = events.reduce((total, event) => {
    return total + event.fee * (100 - event.seats) // Assuming some seats are taken
  }, 0)
  console.log("Total potential revenue:", totalRevenue)

  // Find example - get specific event
  const musicEvent = events.find((event) => event.category === "music")
  console.log("First music event:", musicEvent)

  // Some/Every examples
  const hasExpensiveEvents = events.some((event) => event.fee > 20)
  const allHaveSeats = events.every((event) => event.seats > 0)
  console.log("Has expensive events:", hasExpensiveEvents)
  console.log("All events have seats:", allHaveSeats)
}

// Object methods examples
function demonstrateObjectMethods() {
  const sampleEvent = events[0]

  // Object.keys, Object.values, Object.entries
  console.log("Event keys:", Object.keys(sampleEvent))
  console.log("Event values:", Object.values(sampleEvent))
  console.log("Event entries:", Object.entries(sampleEvent))

  // Object.assign for cloning
  const eventCopy = Object.assign({}, sampleEvent)
  console.log("Event copy:", eventCopy)
}

// Modern JavaScript features examples
function demonstrateModernJS() {
  // Destructuring
  const [firstEvent, secondEvent, ...restEvents] = events
  console.log("First event:", firstEvent.name)
  console.log("Remaining events count:", restEvents.length)

  // Object destructuring
  const { name, category, fee } = firstEvent
  console.log(`Event: ${name}, Category: ${category}, Fee: $${fee}`)

  // Spread operator
  const eventsCopy = [...events]
  console.log("Events copy length:", eventsCopy.length)

  // Template literals
  const eventSummary = `We have ${events.length} events available, including ${events.filter((e) => e.category === "music").length} music events.`
  console.log(eventSummary)

  // Default parameters
  function createEvent(name = "Unnamed Event", category = "general", fee = 0) {
    return new Event(Date.now(), name, new Date(), category, "TBD", 50, fee, "No description")
  }

  const newEvent = createEvent("Test Event")
  console.log("New event:", newEvent)
}

// Async/await example with error handling
async function fetchEventsFromAPI() {
  try {
    // Simulate API call
    const response = await fetch("/api/events")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch events:", error)

    // Return mock data as fallback
    return [
      {
        id: 999,
        name: "Mock Event",
        date: "2024-08-01",
        category: "community",
        location: "Online",
        seats: 100,
        fee: 0,
        description: "This is a mock event for demonstration",
      },
    ]
  }
}

// Promise example
function loadEventData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (events.length > 0) {
        resolve(events)
      } else {
        reject(new Error("No events available"))
      }
    }, 1000)
  })
}

// Use the promise
loadEventData()
  .then((data) => {
    console.log("Events loaded successfully:", data.length)
  })
  .catch((error) => {
    console.error("Failed to load events:", error.message)
  })

// Debug helper functions
function debugEventData() {
  console.group("Event Debug Information")
  console.log("Total events:", events.length)
  console.log("Available events:", events.filter((e) => e.checkAvailability()).length)
  console.log(
    "Events by category:",
    events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1
      return acc
    }, {}),
  )
  console.groupEnd()
}

// Call debug function in development
if (window.location.hostname === "localhost") {
  setTimeout(debugEventData, 2000)
}

// Initialize demonstrations
setTimeout(() => {
  demonstrateArrayMethods()
  demonstrateObjectMethods()
  demonstrateModernJS()
}, 3000)

// Export functions for testing (if using modules)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Event,
    filterEventsByCallback,
    createRegistrationCounter,
    events,
  }
}
