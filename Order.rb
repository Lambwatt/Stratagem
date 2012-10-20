require "OrderToken.rb"

class Order
	def initialize
	end
	
	def create_tokens
	end
end

class Move_order<Order
	#tmp reader for testing
	attr_reader :unit, :dirs
	
	def initialize(unit, moves)
		@unit = unit
		@dirs = moves
	end	
	
	def create_tokens
		tokens = Move_Token.new(@unit, @dirs[0])
		(1...@dirs.size).each{|i|
			tokens.append Move_Token.new(@unit, @dirs[i])
		}
		return tokens
	end
end

def print_token_list(tokenList)
	listWalker = tokenList
	while listWalker.next!= :end
		listWalker = listWalker.next
	end
	
end


=begin
testUnit1 = Bumper.new(1,0)
testBoard1 = Board.new(3,3)

json_test_string = '{"json_class":"Move_order","data":[[1,0],["south_east","south_west","south"]]}'
test_obj = JSON.parse(testBoard1, json_test_string)
p test_obj.class
p test_obj.unit
p test_obj.moves
=end
=begin
order1 = Move_order.new(testUnit1, [ :east ])
print "ended\n"

orderlist1 = order1.create_tokens
print "got token list\n"

print_token_list orderlist1

print "test 1 complete\n"

order2 = Move_order.new(testUnit1, [ :east, :west ])
print "order2 created\n"

orderList2 = order2.create_tokens
print "got token list\n"

print_token_list orderList2

print "test 2 complete\n"

orderlist1.append orderList2
print_token_list orderlist1



testBoard1.place_unit!(testUnit1, 1, 0)

testBoard1.print_board
executeOrders(orderlist1, testBoard1)

testBoard1.print_board

print "test 3 completed\n"
=end



