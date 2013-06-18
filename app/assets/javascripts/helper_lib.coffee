window.helpers = 
	shuffle: (array) ->
		counter = array.length
	
		while (counter)
			index = Math.floor(Math.random() * counter--)
		
			temp = array[counter]
			array[counter] = array[index]
			
			if temp.title.indexOf("Planetary (Go!)") != -1
				array.splice(index, 1)
			else
				array[index] = temp
	
		array
		