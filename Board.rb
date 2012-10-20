require "unit.rb"

#bababoui bababoui bababoui bababoui
class Point
	attr_reader :x, :y, :isValid
	
	def initialize(x,y,validity)
		@x, @y, @isValid = x, y, validity
	end
end

class Board
	
	def initialize(height,width)
		@HEIGHT = height
		@WIDTH = width
		@board = Array.new
		(0...@HEIGHT).each{|i|
			@board[i] = []
			(0...@WIDTH).each{|j|
				@board[i][j] = :empty
			}
		}
	end
	
	
	
	def move_unit!(unit, moves)
		
		#get starting coordinates
		x = unit.pos_x
		y = unit.pos_y
		
		#locate actual tile
		tile = trace_direction(x,y,moves)
		x, y = tile.x, tile.y
		
		#check boundaries
		x = 0 if(x<0)
		x = @WIDTH-1 if(x >= @WIDTH)
		y = 0 if(y<0)
		y = @HEIGHT-1 if(y >= @HEIGHT)
		
		#move and delete
		@board[x][y] = @board[unit.pos_x][unit.pos_y]
		@board[unit.pos_x][unit.pos_y] = :empty
		unit.pos_x, unit.pos_y = x, y
		

	end
	
	def trace_direction(in_x, in_y, moves)
		x = in_x
		y = in_y
				
		case moves
		when :north
			y= y-1
		when :north_east
			x, y = x+1, y-1
		when :east
			x = x+1
		when :south_east
			x, y = x+1, y+1
		when :south
			y = y +1
		when :south_west
			x, y = x-1, y+1
		when :west
			x = x-1
		when :north_west
			x, y = x-1, y-1
		end

		#check boundaries.  Not used for anything right now, but should change this for validation
		validity = !(x<0 or x >= @WIDTH or y<0 or y >= @HEIGHT)
		
		return Point.new(x,y,validity)		
	end
	
	def place_unit!(unit,x,y)	
		@board[x][y] = unit if(@board[x][y] == :empty)
	end
	
	def get_tile(point)
		
		if point.isValid 

			return @board[point.x][point.y] 
		else
			return :off_board
		end
	end
	
	#add meta programming to tell when to use which
	#follow moves steps in dir and return true for a block.  Also accepts a target unit in moves 
	def check_for_block_steps(unit, moves, dir)
		
	end
	
	def check_for_block_target(unit, target, dir)
	end
	
	#This is the key.  When you have tested this, the prototype is ready for further design.
	#Until then, CODE YOUR ASS OFF!!!!
	def parse_orders(orders, jstring)
		orders.each{|i|
			token = i.create_tokens()
			while(token != :end)
				response = token.execute(self)
				if(response!= nil)
					jstring<<(response)
					jstring<<"," if(token.next != :end)
				end
				token = token.next
			end
		}
	end
	
	def print_board()
			print "o"
			(0... @WIDTH).each{
				print "-"
			}
			print "o\n"
			(0... @HEIGHT).each{ |i|
				print "|"
				(0... @WIDTH).each{|j|
					x = get_tile(Point.new(j, i, true))
					#case x
					#when :empty
					if x == :empty
						print "_"
					else
						print "B"
					end
				}
				print "|\n"
			}
			print "o"
			(0... @WIDTH).each{
				print "-"
			}
			print "o\n\n"		
		end	
end



