Food Finder

A web application that helps users discover food options based on their search queries. The app provides a simple and accessible interface to search for different types of food with a clean UI, dark mode toggle, and search functionality.

📹 Demo Video
Watch the Food Finder Demo on YouTube (https://youtu.be/q5jYJZKyaCY)

 🔗 Live Site
Live Website (https://www.delucie.tech/)

🌟 Features
- Search for different types of food using TheMealDB API
- Display search results with images.
- Toggle between dark and light modes
- Simple and responsive design for various devices

🛠️ Technologies Used
- HTML, CSS, JavaScript for frontend
- External font and icon library: FontAwesome
- API Integration: TheMealDB API for fetching food-related data

⚙️ Prerequisites
- A modern web browser with JavaScript enabled
- TheMealDB API key (provided in "config.js")

🚀 Setup Instructions

Clone the repository:
git clone https://github.com/Delucie-coder/place_finder
cd place_finder

Configure API Key:
1. Open the `config.js` file in the root directory.
2. Replace the placeholder API key with your own key from TheMealDB:

const config = {
    apiKey: "YOUR_API_KEY_HERE"
};


Run the Application:
Simply open "index.html" in your browser or deploy the project to a web server.

📋 Usage
1. Enter a food name in the search box (e.g., "Pizza", "Pasta")
2. Click on the search button
3. View food search results with images and categories.
4. Click the moon/sun icon to switch between dark and light modes

🌐 Deployment
The application is deployed on two Amazon web servers (web-01 and web-02) that serve the application via NGINX. A load balancer server (lb-01) maps to the domain www.delucie.tech via A record and distributes traffic evenly across web-01 and web-02 using HAProxy.

Web Servers Setup (web-01 and web-02)
Application Deployment

Application files are placed in /var/www/place_finder

NGINX Configuration

Created a server block in /etc/nginx/sites-available/place_finder:
server {
    listen 80 default_server;
    server_name www.delucie.tech;

    location / {
        root /var/www/place_finder;

        proxy_pass http://54.234.240.192;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Allow CORS
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'Origin, Content-Type, Accept, Authorization';

        add_header X-Served-By $hostname;
    }
}
Enabled the site:
ln -s /etc/nginx/sites-available/place_finder /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
Load Balancer Setup (lb-01)
HAProxy Configuration

Configured HAProxy in /etc/haproxy/haproxy.cfg:
global
    log 127.0.0.1 local0 notice
    maxconn 2000
    user haproxy
    group haproxy

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    retries 3
    option redispatch
    timeout connect  5000
    timeout client  10000
    timeout server  10000

frontend http-front
    bind *:80
    # Perform a 301 redirect to the HTTPS version of the URL
    http-request redirect scheme https code 301 unless { ssl_fc }
    reqadd X-Forwarded-Proto:\ http
    default_backend lb-back

frontend https-front
    bind *:443 ssl crt /etc/haproxy/certs/www.delucie.tech.pem
    reqadd X-Forwarded-Proto:\ https
    default_backend lb-back

backend lb-back
    balance roundrobin
    server web-01 34.238.136.196	 check
    server web-02 3.83.52.32 check
Restarted HAProxy:
systemctl restart haproxy
SSL Certificate Setup

Obtained SSL certificate for www.delucie.tech
Combined certificate and private key into a PEM file
Placed at /etc/haproxy/certs/www.delucie.tech.pem
Testing Load Balancing

Verified load balancing with:
curl -sI https://www.delucie.tech
Confirmed different web servers are served based on the 'X-Served-By' header
Verified that HTTP requests are properly redirected to HTTPS

🔒 Security Considerations
- Ensure API keys are stored securely and not exposed in public repositories
- Use HTTPS for secure data transmission

💻 Browser Support
The application is compatible with all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

👥 Contributing
1. Fork the repository
2. Create your feature branch ("git checkout -b feature/AmazingFeature")
3. Commit your changes ("git commit -m 'Add some AmazingFeature')
4. Push to the branch ("git push origin feature/AmazingFeature")
5. Open a Pull Request

🙏 Acknowledgments
- Open-source community for inspiration and resources
- FontAwesome for providing icons
- TheMealDB for food-related data


