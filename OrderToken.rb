require "Unit.rb"
require "Board.rb"
require "rubygems"
require "json"

class OrderToken
	attr_accessor :next
	def initialize()
		@next = :end
	end
	
	def execute
	end
	
	def to_json(*a)
		{
			"json_class" => self.class.name,
			"data" => ["unspecified_token"]
		}.to_json(*a) #uses built in to_json for hash?
	end
	
	def +(order)
		append(order)
	end
	
	def append(nextOrder)
		if(@next== :end)
			@next = nextOrder
		else
			@next.append(nextOrder)
		end
	end
	
	def insert(newOrder)
		newOrder.next = @next
		@next = newOrder
	end
end

class Move_Token < OrderToken
	attr_reader :unit, :dir
	def initialize(unit, dir)
		super()
		@unit = unit
		@tile = [unit.pos_x, unit.pos_y]
		@dir = dir
	end
	
	def to_json(*a)
	{
		"json_class" => self.class.name,
		"data" => { "x"=> @tile[0], "y"=> @tile[1], "dir"=> @dir}
	}.to_json(*a) 
	end	
	
	def execute(board)	
		contents = board.get_tile(board.trace_direction(@unit.pos_x, @unit.pos_y, @dir))
		if(contents != :off_board)
			if(contents == :empty)
				board.move_unit!(@unit, @dir)
				return JSON.generate(self) 
			else
				insert AttackToken.new(@unit, board.get_tile(board.trace_direction(@unit.pos_x, @unit.pos_y, @dir)))
				return nil
			end
		end
	end
end

class AttackToken < OrderToken
	
	def initialize(unit, foe)
		super()
		@unit = unit
		@foe = foe
	end
	
	def to_json(*a)
	{
		"json_class" => self.class.name,
		"data" => {"unit_x"=>@unit.pos_x, "unit_y"=>@unit.pos_x, "foe_x"=>@foe.pos_x, "foe_y"=>@foe.pos_y}
	}.to_json(*a) #uses built in to_json for hash
	end	
	
	def execute(board)
		@foe.hp -= @unit.attack
		return JSON.generate(self)
	end
	
		
end

class OvertakeToken < OrderToken
	def execute
	end
end

class BonusToken < OrderToken
	def execute
	end
end

class AttackNearestToken < OrderToken
	def execute
	end
end

class AttackPositionToken < OrderToken
	def execute
	end
end

class AttackUnitToken < OrderToken
	def execute
	end
end

#local testing method.  Not used for stuff
def executeOrders(order, board)
	while(order!= :end)		
		jstring = order.execute(board)
		order = order.next		
	end 
end

board = Board.new(3,3)
testo = Bumper.new(1,1)

board.place_unit!(testo,1,1)#fix so only one set of co-ords is needed.
=begin
orderList = MoveToken.new(board, testo, :north)
orderList.append MoveToken.new(board, testo, :north)
orderList.append MoveToken.new(board, testo, :south)
orderList.append MoveToken.new(board, testo, :northEast)
orderList.append MoveToken.new(board, testo, :northEast)
orderList.append MoveToken.new(board, testo, :southWest)
orderList.append MoveToken.new(board, testo, :east)
orderList.append MoveToken.new(board, testo, :east)
orderList.append MoveToken.new(board, testo, :west)
orderList.append MoveToken.new(board, testo, :southEast)
orderList.append MoveToken.new(board, testo, :southEast)
orderList.append MoveToken.new(board, testo, :northEast)
orderList.append MoveToken.new(board, testo, :south)
orderList.append MoveToken.new(board, testo, :south)
orderList.append MoveToken.new(board, testo, :north)
orderList.append MoveToken.new(board, testo, :southWest)
orderList.append MoveToken.new(board, testo, :southWest)
orderList.append MoveToken.new(board, testo, :northEast)
orderList.append MoveToken.new(board, testo, :west)
orderList.append MoveToken.new(board, testo, :west)
orderList.append MoveToken.new(board, testo, :east)
orderList.append MoveToken.new(board, testo, :northWest)
orderList.append MoveToken.new(board, testo, :northWest)
orderList.append MoveToken.new(board, testo, :southEast)
=end

=begin
popo = Bumper.new(0,0)
board.place_unit!(popo, 0, 0)

testo.setName("testo")
popo.setName("popo")

p "#{popo.hp}"

orderList = MoveToken.new(testo, :north_west)
orderList.append(MoveToken.new(testo, :north))
orderList.append(MoveToken.new(testo, :west))
orderList.append(MoveToken.new(testo, :south_west))
orderList.append(MoveToken.new(testo, :north))

executeOrders(orderList, board)

p "#{popo.hp}"
p "testo #{testo.hp}"

board.print_board()

orderList = nil

=end

#move_json_test = Move_Token.new(testo, :north)
#print move_json_test.execute(board)


