require "Player.rb"
require "Board.rb"
require "Order_constructor.rb"

class Game
	
	def initialize
		@board = Board.new(3,3)
		#@factory = Order_factory.new(@board)
		@player_1 = Player.new
		@player_2 = Player.new
		@players = Array.new
		@players<< @player_1 << @player_2
		@order_list = Array.new
		@response = String.new
		
	end
	
	def setup_test_game
		test_unit = Bumper.new(1,0)
		@player_1.unit_list[0] = test_unit
		test_victim = Bumper.new(2,2)
		@player_2.unit_list[0] = test_victim
		
		@board.place_unit!(test_unit, test_unit.pos_x, test_unit.pos_y)
		@board.place_unit!(test_victim, test_victim.pos_x, test_victim.pos_y)		
	end
	
	def receive_orders(jstring)
		JSON_string_to_order_list(jstring, @board, @players)
	end
	
	def run_turn

		@board.print_board

		(0... @player_1.order_list.size()).each{|i| @order_list[i*2] = @player_1.order_list[i]}
		(0... @player_2.order_list.size()).each{|i| @order_list[i*2 + 1] = @player_2.order_list[i]}
		
		p @order_list
		p ""
		
		@board.parse_orders(@order_list, @response)
		
		@board.print_board		
		
		p"response: #{@response}"
		return @response
	end
end


#test_game = Game.new
#test_game.setup_test_game

#player_1_string = '[0,{"json_class":"Move","data":[{"coords":[1,0],"dirs":["south","south_east"]}]},{"json_class":"Move","data":[{"coords":[1,0],"dirs":["west","south"]}]}]'
#player_2_string = '[1,{"json_class":"Move","data":[{"coords":[2,2],"dirs":["north","north","south_west"]}]},{"json_class":"Move","data":[{"coords":[2,2],"dirs":["south"]}]}]'

#test_game.receive_orders(player_1_string)
#test_game.receive_orders(player_2_string)

#test_game.run_turn


