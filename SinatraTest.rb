require "rubygems"
require 'sinatra'
require 'Game.rb'

set :public_folder, File.dirname(__FILE__) + '/front_end'

json_response = "no response yet"

test_input_1 = "[0,{<&quot>json_class<&quot>:<&quot>Move<&quot>,<&quot>data<&quot>:[{<&quot>coords<&quot>:[1,0],<&quot>dirs<&quot>:[<&quot>south<&quot>,<&quot>south_east<&quot>]}]},{<&quot>json_class<&quot>:<&quot>Move<&quot>,<&quot>data<&quot>:[{<&quot>coords<&quot>:[1,0],<&quot>dirs<&quot>:[<&quot>west<&quot>,<&quot>south<&quot>]}]}]"
test_input_2 = "[1,{<&quot>json_class<&quot>:<&quot>Move<&quot>,<&quot>data<&quot>:[{<&quot>coords<&quot>:[2,2],<&quot>dirs<&quot>:[<&quot>north<&quot>,<&quot>north<&quot>,<&quot>south_west<&quot>]}]},{<&quot>json_class<&quot>:<&quot>Move<&quot>,<&quot>data<&quot>:[{<&quot>coords<&quot>:[2,2],<&quot>dirs<&quot>:[<&quot>south<&quot>]}]}]"

test_game = Game.new
test_game.setup_test_game

players = 1;

get '/getPlayerNumber' do
	result = ''
	if(players<=2)
		result+="{playerNumber:#{players}}"
		players+=1
	else
		result+="{playerNumber:#{-1}}"
	end
	p "result = #{result}"
	return result
end
	
get '/game/' do
	
	result = ''
	if(players<=2)
		result+="{playerNumber:#{players}}"
		players+=1
	else
		result+="{playerNumber:#{-1}}"
	end
		
	file = File.read(File.join('front_end','testenv.html'))
	split = file.split("<input type=\"hidden\" id=\"result\" value=\"\"/>\n")
	game  = ""
	game << split[0];
	
	game<<'<input type="hidden" id="result" value="'<<result<<'"/>'

	game << split[1]
	p game
	
	
	return game#File.read(File.join('front_end','testenv.html'))
end	

get '/hi' do
	'<html>
		<head>
		<script>
		function myFunction()
		{
			alert("Hello World!");
		}
		</script>
		</head>		
		<form
			name="input" action="hi" method="post">
			player 1 moves:<input type="text" name="p1Move" value="'+test_input_1+'">		 
			player 2 moves:<input type="text" name="p2Move" value="'+test_input_2+'">
			<input type="submit" value="Click Me!">
		</form>	
	<html>'
end

post '/hi' do
	
	
	dic = {"params"=>params}
	#p dic
	#p dic[ "params"]["p1Move"]
	
		
	
	test_game.receive_orders(dic[ "params"]["p1Move"].gsub(/[<>]/,""))
	test_game.receive_orders(dic[ "params"]["p2Move"].gsub(/[<>]/,""))
	
	response_string = test_game.run_turn	
	#response_string = "reponse will be here"
	response_string.gsub(/["]/,"<&quot>")
	
  	return '<html>
			<form
				name="input" action="hi" method="post">
				player 1 moves:<input type="text" name="p1Move" value="'+test_input_1+'">		 
				player 2 moves:<input type="text" name="p2Move" value="'+test_input_2+'">
				 <input type="submit" value="Click Me!">
			</form>
			'+response_string+'
		</html>'
end




