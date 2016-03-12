describe("CampoMinado", function() {
  beforeEach(function() {
    jQuery('#campo').remove();
    jQuery('body').append('<div id="game" style="display:none;"></div>');
    jQuery('body').append('<style>#campo {margin: 0 auto;text-align: center;margin-top: 40px;}#campo #result {text-align:center;margin-top:10px;border-radius:10px;padding: 5px 10px;border: 1px solid #ccc;box-shadow:3px 3px 2px #dfdfdf;}.block {width:25px;height:25px;background: #339;display: inline-block;border: 1px solid #fff;color: #fff;cursor: pointer;}.block.lost {background: #933;}.block.opened:not(.lost) {background: #393;}.block:not(.lost,.opened):hover {background: #55B;}.clearfix {clear: both;}')
  });

  describe("Verify if the", function() {
    it("title was created", function() {
      game.setVars(jQuery('#game'), 4, 4, 2);
      game.drawBoard();

      var result = jQuery('#game').find('h1').html();
      expect('Minesweeper').toBe(result);
    });

    it("invisible field was created", function() {
      game.setVars(jQuery('#game'), 4, 4, 2);
      game.drawBoard();

      var result = jQuery('#game').find('#result').length;
      expect(1).toBe(result);
    });

    it("invisible field was created", function() {
      game.setVars(jQuery('#game'), 4, 4, 2);
      game.drawBoard();

      var result = jQuery('#game').find('#result').length;
      expect(1).toBe(result);
    });
  });

  describe("Validate if", function() {
    it("the appendBlock has the correct attributes", function() {
      var block = game.appendBlock(4, 2);

      var result = jQuery(block);
      expect(result.attr('id')).toBe('4-2');
      expect(result.attr('data-line')).toBe('2');
      expect(result.attr('data-column')).toBe('4');
    });

    it("the drawBoard has the correct number of spaces", function() {
      game.setVars(jQuery('#game'), 4, 4, 2);
      game.drawBoard();

      var result = jQuery('#game').find('.block');
      expect(16).toBe(result.length);
    });

    it("isn't possible to set a number of bombs greater than spaces", function() {
      game.setVars(jQuery('#game'), 4, 4, 20);
      expect(function() {game.generateBombs()}).toThrow();
    });
  });

  describe("Check bombs", function() {
    beforeEach(function() {
      game.setVars(jQuery('#game'), 4, 4, 0);
      game.drawBoard();
      game.initializeBombs();
    });

    it("distance in zero bombs", function() {
      game.getDistances();

      expect(game.bombs[1][1]).toBe(0);
      expect(game.bombs[2][2]).toBe(0);
    });

    it("distance in one bomb", function() {
      // [1][1][1]
      // [1][x][1]
      // [1][1][1]
      game.addBomb(1,1);
      game.getDistances();

      game.drawBoard();
      game.addEvents();

      for(var i = 0; i< 3; i++) {
        for(var j=0; j< 3; j++) {
          if(i == 1 && j == 1) {
            expect(game.bombs[i][j]).toBe('x');
          } else {
            expect(game.bombs[i][j]).toBe(1);
          }
        }
      }
    });

    it("distance between two bombs", function() {
      // [1][2][1]
      // [x][2][x]
      // [1][2][1]
      game.addBomb(0,1);
      game.addBomb(2,1);

      game.getDistances();
      game.addEvents();

      expect(game.bombs[0][0]).toBe(1);
      expect(game.bombs[0][2]).toBe(1);
      expect(game.bombs[1][0]).toBe(2);
      expect(game.bombs[1][1]).toBe(2);
      expect(game.bombs[1][2]).toBe(2);
      expect(game.bombs[2][0]).toBe(1);
      expect(game.bombs[2][2]).toBe(1);
    });

    it("distance between three bombs", function() {
      // [x][3][1]
      // [x][x][1]
      // [2][2][1]
      game.addBomb(0,0);
      game.addBomb(0,1);
      game.addBomb(1,1);

      game.getDistances();

      expect(game.bombs[1][0]).toBe(3);
      expect(game.bombs[2][0]).toBe(1);
      expect(game.bombs[2][1]).toBe(1);
      expect(game.bombs[0][2]).toBe(2);
      expect(game.bombs[1][2]).toBe(2);
      expect(game.bombs[2][2]).toBe(1);
    });

    it("distance between three bombs", function() {
      // [x][3][1]
      // [x][x][1]
      // [2][2][1]
      game.addBomb(0,0);
      game.addBomb(0,1);
      game.addBomb(1,1);

      game.getDistances();

      expect(game.bombs[1][0]).toBe(3);
      expect(game.bombs[2][0]).toBe(1);
      expect(game.bombs[2][1]).toBe(1);
      expect(game.bombs[0][2]).toBe(2);
      expect(game.bombs[1][2]).toBe(2);
      expect(game.bombs[2][2]).toBe(1);
    });

  });

  describe("Test event", function() {
    beforeEach(function() {
      game.setVars(jQuery('#game'), 4, 4, 0);
      game.drawBoard();
      game.addEvents();
    });
    it("checking as a bomb in place", function() {
      var block = jQuery('#game .block');

      block.trigger('contextmenu');
      expect(block.html()).toBe('!');
    });

    it("asking as a bomb in place", function() {
      var block = jQuery('#game .block')

      block.trigger('contextmenu');
      block.trigger('contextmenu');

      expect(block.html()).toBe('?');
    });

    it("removing ask a bomb in place", function() {
      var block = jQuery('#game .block');

      block.trigger('contextmenu');
      block.trigger('contextmenu');
      block.trigger('contextmenu');

      expect(block.html()).toBe('&nbsp;');
    });

  });

  describe('Checking bomb', function() {
    beforeEach(function() {
      game.setVars(jQuery('#game'), 4, 4, 0);
      game.drawBoard();
      game.initializeBombs();
      game.addEvents();

      window.alert = function(){return;};
    });

    it('is called on click', function() {
      spyOn(game, 'checkBomb');

      var block = jQuery('#game .block');
      block.trigger('click');

      expect(game.checkBomb).toHaveBeenCalled();
    });

    it('return null if checked as "!"', function() {
      var block = jQuery('#game .block');
      block.trigger('contextmenu');

      var finalValue = game.checkBomb(game, block);

      expect(finalValue).toBeNull();
    });

    it('return null if checked as "?"', function() {
      var block = jQuery('#game .block');
      block.trigger('contextmenu');
      block.trigger('contextmenu');

      var finalValue = game.checkBomb(game, block);

      expect(finalValue).toBeNull();
    });

    it('checking if lost the game', function() {
      game.addBomb(0, 0);
      var block = jQuery(jQuery('#game .block')[0]);
      spyOn(game, 'endGame');

      var finalValue = game.checkBomb(game, block);

      expect(game.endGame).toHaveBeenCalledWith(game, true, block);
    });

    it('checking call win the game', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      spyOn(game, 'checkIfWinGame');

      var finalValue = game.checkBomb(game, block);

      expect(game.checkIfWinGame).toHaveBeenCalled();
    });

    it('and marking around area with 0 bombs', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      spyOn(game, 'removeNextCleanedArea');

      var finalValue = game.checkBomb(game, block);

      expect(game.removeNextCleanedArea).toHaveBeenCalledWith(game, 0, 0);
    });

    it('and marking block as opened', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      var finalValue = game.checkBomb(game, block);

      expect(block.hasClass('opened')).toBe(true);
    });
  });

  describe('Ending game', function() {
    beforeEach(function() {
      window.alert = function(){return;};
    });

    it('adding class when lost a game', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      game.endGame(game, true, block);

      expect(block.hasClass('lost')).toBe(true);
    });

    it('changing text status', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      var result = jQuery('#result');
      game.endGame(game, true, block);

      expect(result.val()).toBe('Kabooooooooooooom!');
    });

    it('changing text status when win the game', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      var result = jQuery('#result');
      game.endGame(game, false, block);

      expect(result.val()).toBe('Você venceu!');
    });
  });

  describe('Checking if win a game', function() {
    beforeEach(function() {
      game.setVars(jQuery('#game'), 2, 2, 0);
      game.drawBoard();
      game.initializeBombs();
      game.addEvents();
    });

    it('close the game', function() {
      spyOn(game, 'endGame');
      jQuery('#game .block').addClass('opened');
      game.checkIfWinGame(game);

      expect(game.endGame).toHaveBeenCalledWith(game, false);
    });

    it('not close the game', function() {
      spyOn(game, 'endGame');
      jQuery('#game .block');
      game.checkIfWinGame(game);

      expect(game.endGame).not.toHaveBeenCalledWith();
    });
  });

});
