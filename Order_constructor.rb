require "order.rb"
require "json"
	
def JSON_string_to_order_list(jstring, board, player_list)
	order_package = JSON.parse(jstring)
	order_list = player_list[order_package[0]].order_list
	(1...order_package.size()).each{|i| order_list[i-1] = order_package[i].make_order(board)}
end	


class Order_keyword
	attr_reader :data
	
	def initialize(args)
		@data = args#JSON.parse(jstring, opts=>{"object_class"=>true})
	end
			
	def self.json_create(o)
		new(*o["data"])
	end
end

class Move<Order_keyword
	def make_order(board)
		subject = board.get_tile(Point.new(@data["coords"][0],@data["coords"][1],true))
		dirs = @data["dirs"]#.each{|i| i=i.to_sym}
		dirs.map!{|i| i.to_sym}
		order = Move_order.new(subject,dirs)
	end
end

class Move_call	
		
	def self.json_create(o, board)
		new(*o["data"])
	end	
end

	

=begin
test_list = JSON.parse(test_string_with_multiple_orders)

test_list.each{|i| p i}
p "got here yo!"


=begin
test_board=Board.new(3,3)
test_unit = Bumper.new(1,0)
test_victim = Bumper.new(2,2)

test_board.place_unit!(test_unit, test_unit.pos_x, test_unit.pos_y)
test_board.place_unit!(test_victim, test_victim.pos_x, test_victim.pos_y)
test_board.print_board

test_obj = JSON.parse(json_test_string)
test_obj_2 = JSON.parse(json_test_string_2)

test_order = test_obj.make_order(test_board)
test_order_2 = test_obj_2.make_order(test_board)

test_order_list = Array.new()
test_order_list<<test_order
test_order_list<<test_order_2

output_test_string = String.new()
test_board.parse_orders(test_order_list, output_test_string)

test_board.print_board
p output_test_string
=end


