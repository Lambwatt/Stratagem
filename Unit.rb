class Unit
	attr_accessor :pos_x, :pos_y, :hp
	attr_reader :attack
	
	def initialize()
		@hp = 5
		@attack = 2
		@pos_x = 0
		@pos_y = 0
		@unit = :unit
	end
end

class Bumper < Unit
	attr_reader :name
	
	def initialize(x,y)
		super()
		@pos_x = x
		@pos_y = y
		@unit = :bumper
		@name = "unnamed"
	end
	
	def setName(name)
		@name = name
	end
end