window.helpers = 
	shuffle: (array) ->
		counter = array.length
	
		while (counter)
			index = Math.floor(Math.random() * counter--)
			temp = array[counter]
			array[counter] = array[index]
			array[index] = temp
	
		array