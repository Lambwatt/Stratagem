require "Game.rb"
require "socket"
require 'net/http'

#If you ever actually want a real server, look into Webfaction or Heroku (but they both cost money)

 #not used as a class yet
#class Server	
#end
require 'socket'

#server = TCPServer.new 8000 # Server bind to port 2000
#loop do
#  client = server.accept    # Wait for a client to connect
#  client.puts "Hello !"
#  client.puts "Time is #{Time.now}"
#  client.close
#end


webserver = TCPServer.new 8000
while (session = webserver.accept)
   session.print "HTTP/1.1 200/OK\r\nContent-type:text/html\r\n\r\n"
   request = session.gets 
   if(request!=nil)
	   #trimmedrequest = request.gsub(/GET\ \//, '').gsub(/\ HTTP.*/, '') 
	   #filename = trimmedrequest.chomp
	   #p "#{filename}"
	   #if filename == ""
	   #   filename = "index.html"
	   #end
	   filename = "testPage.html"
	   begin
	   	p "#{filename}"
	      displayfile = File.open(filename, 'r')
	      content = displayfile.read()
	      session.print content
	   rescue Errno::ENOENT
	      session.print "File not found"
	   end
   end
	session.close
end
