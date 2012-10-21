require "Order_constructor.rb"
require "Order.rb"
require "Unit.rb"

class Player
	attr_accessor :order_list, :unit_list
		
	def initialize
		@order_list = Array.new
		@unit_list = Array.new
				
	end
end